// import { Module } from '@nestjs/common';
// import { LogProcessingController } from './log-processing.controller';
// import { LogProcessingService } from './log-processing.service';

// @Module({
//   controllers: [LogProcessingController],
//   providers: [LogProcessingService]
// })
// export class LogProcessingModule {}
import { Module } from '@nestjs/common';
import { LogController } from './log-processing.controller';
import { LogService} from './log-processing.service';
import { BullMQProvider } from './bullmq.provider';
import { JobProcessor } from './job.processor';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { ConfigModule } from '@nestjs/config';
import { LiveStatsGateway } from 'src/websocket/live-stats.gateway';

@Module({
  imports: [ConfigModule],
  controllers: [LogController],
  providers: [LogService, BullMQProvider, JobProcessor, SupabaseProvider,LiveStatsGateway],
})
export class LogProcessingModule {}
