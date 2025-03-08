import { Injectable, Logger } from '@nestjs/common';
import { BullMQProvider } from './bullmq.provider';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(
    private readonly bullmqProvider: BullMQProvider,
    private readonly supabaseProvider: SupabaseProvider,
  ) {}

  async enqueueLogFile(file: Express.Multer.File): Promise<string> {
    const fileId = uuidv4();

    // Save file to a local directory
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, fileId + '-' + file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    // Calculate priority (smaller files have higher priority)
    const priority = Math.max(0, 2097152 - file.size);

    // Add job to BullMQ queue with metadata
    await this.bullmqProvider.queue.add(
      'process-log-file',
      { fileId, filePath },
      {
        priority, // Set priority based on file size
        attempts: this.bullmqProvider.retryLimit,
      },
    );

    this.logger.log(`Enqueued job for fileId: ${fileId}`);
    return fileId;
  }

  async getAggregatedStats() {
    // Query Supabase for aggregated stats
    const { data, error } = await this.supabaseProvider.supabase
      .from('log_stats')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getJobStats(jobId: string) {
    // Query Supabase for stats for the specific job
    const { data, error } = await this.supabaseProvider.supabase
      .from('log_stats')
      .select('*')
      .eq('file_id', jobId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getQueueStatus() {
    // Fetch queue job counts
    const counts = await this.bullmqProvider.queue.getJobCounts();
    return counts;
  }
}