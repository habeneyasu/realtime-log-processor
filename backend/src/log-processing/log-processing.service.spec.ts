import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log-processing.service';
import { BullMQProvider } from './bullmq.provider';
import { SupabaseProvider } from '../supabase/supabase.provider';

describe('LogService (Unit Test)', () => {
  let service: LogService;

  // Mock BullMQProvider
  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job-id' }), // Mock the add method
  };

  const mockBullmqProvider = {
    queue: mockQueue,
    retryLimit: 3,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        { provide: BullMQProvider, useValue: mockBullmqProvider },
        { provide: SupabaseProvider, useValue: mockSupabaseProvider },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  it('should enqueue a log file', async () => {
    const file = {
      originalname: 'test.log',
      buffer: Buffer.from('test log content'),
      size: 100, // File size is 100 bytes
    } as Express.Multer.File;

    const result = await service.enqueueLogFile(file);

    // Verify the file ID is returned
    expect(result).toBeDefined();


     // Calculate priority (smaller files have higher priority)
     const priority = Math.max(0, 2097152 - file.size);
    // Verify BullMQProvider.queue.add was called with the correct arguments
    expect(mockBullmqProvider.queue.add).toHaveBeenCalledWith(
      'process-log-file',
      { fileId: expect.any(String), filePath: expect.any(String) },
      {
        priority, 
        attempts:3,
      },
    );
  });
});