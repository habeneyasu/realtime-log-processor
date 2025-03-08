// import { Controller } from '@nestjs/common';

// @Controller('log-processing')
// export class LogProcessingController {}
import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogService } from './log-processing.service';
import { Request } from 'express';

@Controller()
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post('api/upload-logs')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLog(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const result = await this.logService.enqueueLogFile(file);
    return { message: 'File uploaded and job enqueued', jobId: result };
  }

  @Get('api/stats')
  async getStats() {
    return this.logService.getAggregatedStats();
  }

  @Get('api/stats/:jobId')
  async getJobStats(@Param('jobId') jobId: string) {
    return this.logService.getJobStats(jobId);
  }

  @Get('api/queue-status')
  async getQueueStatus() {
    return this.logService.getQueueStatus();
  }
}
