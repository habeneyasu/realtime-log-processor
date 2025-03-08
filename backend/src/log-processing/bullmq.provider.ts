import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Queue, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

@Injectable()
export class BullMQProvider implements OnModuleInit {
  public queue: Queue;
  public retryLimit: number;
  private readonly logger = new Logger(BullMQProvider.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisOptions: RedisOptions = {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
    };

    this.queue = new Queue('log-processing-queue', {
      connection: redisOptions,
    });

    // Read retry limit from .env (fallback to 3 if not set)
    this.retryLimit = this.configService.get<number>('BULLMQ_RETRY_LIMIT', 3);

    this.logger.log('BullMQ queue initialized');
  }

  // Method to enqueue the log file with priority
  async enqueueLogFile(fileId: string, filePath: string, fileSize: number): Promise<Job> {
    const jobData = {
      fileId,
      filePath,
    };

    try {
      // Calculate priority (smaller files have higher priority)
      const priority = Math.max(0, 2097152 - fileSize);

      const job = await this.queue.add('process-log', jobData, {
        attempts: this.retryLimit,
        priority, // Set priority based on file size
      });

      this.logger.log(`Enqueued job ${job.id} for file ${fileId} with priority ${priority}`);
      return job;
    } catch (error) {
      this.logger.error('Error enqueuing log file', error);
      throw new Error('Error enqueuing log file');
    }
  }

  // Method to get the current status of the queue
  async getQueueStatus(): Promise<any> {
    try {
      const waiting = await this.queue.getWaitingCount(); // Count of jobs in the waiting state
      const active = await this.queue.getActiveCount();   // Count of jobs being processed
      const completed = await this.queue.getCompletedCount(); // Count of completed jobs
      const failed = await this.queue.getFailedCount();    // Count of failed jobs

      return {
        waiting,
        active,
        completed,
        failed,
      };
    } catch (error) {
      this.logger.error('Error fetching queue status', error);
      throw new Error('Error fetching queue status');
    }
  }
}