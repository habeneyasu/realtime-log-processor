// supabase-test.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseTestService {
  private readonly logger = new Logger(SupabaseTestService.name);
  private supabase;

  constructor(private readonly configService: ConfigService) {}

  async testConnection(): Promise<void> {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');

    // Check if the values are undefined
    if (!url || !key) {
      throw new Error('Supabase URL or Key is not defined in the environment variables.');
    }

    this.supabase = createClient(url, key);

    try {
      const { data, error } = await this.supabase.from('your_table_name').select('*').limit(1);
      if (error) {
        throw new Error(error.message);
      }
      this.logger.log(`Supabase connection test passed. Data fetched: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(`Supabase connection test failed: ${error.message}`);
    }
  }
}
