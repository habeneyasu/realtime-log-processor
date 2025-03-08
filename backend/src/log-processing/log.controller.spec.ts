import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log-processing.controller';
import { LogService } from './log-processing.service';
import { BullMQProvider } from './bullmq.provider';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('LogController (Integration Test)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  // Mock BullMQProvider
  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job-id' }), // Mock the add method
  };

  const mockBullmqProvider = {
    queue: mockQueue,
    retryLimit: 3, // Mock retry limit from .env
  };

  // Mock SupabaseProvider
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({ data: [], error: null }),
  };

  const mockSupabaseProvider = {
    supabase: mockSupabase,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()], // Load .env variables
      controllers: [LogController],
      providers: [
        LogService,
        { provide: BullMQProvider, useValue: mockBullmqProvider },
        { provide: SupabaseProvider, useValue: mockSupabaseProvider },
        ConfigService, // Provide ConfigService
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/upload-logs should upload a log file and enqueue a job', async () => {
    const file = {
      originalname: 'test.log',
      buffer: Buffer.from('test log content'), // File size is 16 bytes
      size: 16, // Explicitly set the file size
    };

    const response = await request(app.getHttpServer())
      .post('/api/upload-logs')
      .attach('file', file.buffer, file.originalname);

    // Verify the response
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'File uploaded and job enqueued',
      jobId: expect.any(String),
    });

    // Calculate priority (smaller files have higher priority)
    const priority = Math.max(0, 2097152 - file.size);

    // Verify BullMQProvider.queue.add was called
    expect(mockBullmqProvider.queue.add).toHaveBeenCalledWith(
      'process-log-file',
      { fileId: expect.any(String), filePath: expect.any(String) },
      {
        priority, // Priority is calculated as Math.max(0, 2097152 - file.size)
        attempts: 3, // Retry limit from .env
      },
    );
  });
});