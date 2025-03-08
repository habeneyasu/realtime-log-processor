export interface LogStat {
    id: number; // Unique identifier for the log entry
    file_id: string; // ID of the file the log belongs to
    timestamp: string; // Timestamp of the log entry
    level: string; // Log level (e.g., ERROR, INFO, WARN)
    message: string; // Log message
    payload: Record<string, any>; // Optional JSON payload
  }