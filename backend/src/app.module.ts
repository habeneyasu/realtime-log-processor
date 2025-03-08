import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogProcessingModule } from './log-processing/log-processing.module';
import { RedisTestService } from './redis-test.service';
import { SupabaseTestService } from './supabase-test.service';
import { LiveStatsGateway } from './websocket/live-stats.gateway';
import { NestApplication } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // This makes ConfigService available globally
      envFilePath: '.env',  // Path to your .env file
    }),
    LogProcessingModule,  // Your log processing module
  ],
  controllers: [AppController],
  providers: [AppService, RedisTestService, SupabaseTestService,LiveStatsGateway],
})
export class AppModule {}
