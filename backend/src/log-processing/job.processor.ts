import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as readline from 'readline';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { LiveStatsGateway } from '../websocket/live-stats.gateway';

@Injectable()
export class JobProcessor implements OnModuleInit {
  private readonly logger = new Logger(JobProcessor.name);
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseProvider: SupabaseProvider,
    private readonly liveStatsGateway: LiveStatsGateway, // Inject WebSocket gateway
  ) {}

  onModuleInit() {
    // Get concurrency from environment variables, default to 4
    let concurrency = this.configService.get<number>('BULLMQ_CONCURRENCY', 4);

    // Validate concurrency
    if (typeof concurrency !== 'number' || concurrency <= 0 || !Number.isFinite(concurrency)) {
      this.logger.warn(`Invalid concurrency value: ${concurrency}. Defaulting to 4.`);
      concurrency = parseInt(process.env.BULLMQ_CONCURRENCY || '4', 10);
    }

    this.worker = new Worker(
      'log-processing-queue',
      async (job: Job) => {
        const { fileId, filePath } = job.data;
        this.logger.log(`Processing job for fileId: ${fileId}`);
        await this.processLogFile(fileId, filePath, job);
      },
      {
        concurrency,
        connection: {
          host: this.configService.get<string>('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT'),
        },
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed`);
      this.liveStatsGateway.broadcastJobUpdate(job.data.fileId, 'completed');
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id || 'unknown'} failed: ${err.message}`);
      this.liveStatsGateway.broadcastJobUpdate(job?.data?.fileId || 'unknown', 'failed');
    });
  }

  async processLogFile(fileId: string, filePath: string, job: Job) {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    let totalLines = 0;

    // Count total lines in the file
    for await (const _ of rl) {
      totalLines++;
    }

    // Reset the file stream
    fileStream.destroy();
    const newFileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const newRl = readline.createInterface({
      input: newFileStream,
      crlfDelay: Infinity,
    });

    // Process each line of the log file
    for await (const line of newRl) {
      lineCount++;
      const progress = Math.floor((lineCount / totalLines) * 100);

      // Broadcast progress update
      this.liveStatsGateway.broadcastJobUpdate(fileId, 'processing');

      const regex = /^\[(.*?)\]\s+(\w+)\s+(.*)$/;
      const matches = line.match(regex);
      if (matches) {
        const [, timestamp, level, rest] = matches;
        let message = rest;
        let payload = null;
        const jsonIndex = rest.indexOf('{');
        if (jsonIndex !== -1) {
          message = rest.substring(0, jsonIndex).trim();
          try {
            payload = JSON.parse(rest.substring(jsonIndex));
          } catch (err) {
            // Log parsing error, continue
          }
        }
        const { error } = await this.supabaseProvider.supabase
          .from('log_stats')
          .insert([{ file_id: fileId, timestamp, level, message, payload }]);
        if (error) {
          this.logger.error(`Error storing log entry: ${error.message}`);
        }
      }
    }

    // Broadcast completion
    this.liveStatsGateway.broadcastJobUpdate(fileId, 'completed');
  }
}