import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseProvider implements OnModuleInit {
  public supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseProvider.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');

    if (!url || !key) {
      throw new Error(
        'Missing Supabase credentials! Ensure SUPABASE_URL and SUPABASE_KEY are set in the environment variables.'
      );
    }

    this.supabase = createClient(url, key);
    this.logger.log('Supabase client initialized');
  }
}
