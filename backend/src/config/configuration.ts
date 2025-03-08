export default () => ({
    port: parseInt(process.env.PORT ?? "5000", 10),
    supabase: {
      url: process.env.SUPABASE_URL || "https://default.supabase.url",
      key: process.env.SUPABASE_KEY || "default_supabase_key",
    },
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
    },
    bullmq: {
      concurrency: parseInt(process.env.BULLMQ_CONCURRENCY ?? "4", 10),
      retryLimit: parseInt(process.env.BULLMQ_RETRY_LIMIT ?? "3", 10),
    },
    logKeywords: process.env.LOG_KEYWORDS ? process.env.LOG_KEYWORDS.split(',') : [],
  });
  
  