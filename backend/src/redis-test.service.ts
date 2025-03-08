// redis-test.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisTestService {
  private readonly logger = new Logger(RedisTestService.name);
  private redisClient: Redis.Redis;

  constructor(private readonly configService: ConfigService) {}

  async testConnection(): Promise<void> {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    
    this.redisClient = new Redis.default({
      host: redisHost,
      port: redisPort,
    });

    try {
      const response = await this.redisClient.ping(); // Sends a PING request to Redis
      this.logger.log(`Redis connection test passed: ${response}`);
    } catch (error) {
      this.logger.error(`Redis connection test failed: ${error.message}`);
    }
  }
}
