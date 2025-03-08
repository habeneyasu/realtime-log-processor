const fs = require('fs');
const path = require('path');

// Define the log file path
const logFilePath = path.join(__dirname, '../logs/large-log-file.log');

// Define the log entry template
const logEntryTemplate = [
  '[2025-02-20T10:00:00Z] ERROR Database timeout {"userId": 123, "ip": "192.168.1.1"}',
  '[2025-02-20T10:01:00Z] INFO User logged in {"userId": 123, "ip": "192.168.1.1"}',
  '[2025-02-20T10:02:00Z] WARN High memory usage {"service": "auth", "memoryUsage": "85%"}',
  '[2025-02-20T10:03:00Z] ERROR File not found {"userId": 456, "ip": "192.168.1.2", "file": "example.txt"}',
  '[2025-02-20T10:04:00Z] INFO Request completed {"userId": 123, "ip": "192.168.1.1", "status": 200}',
].join('\n');

// Define the target file size (10 MB)
const targetSizeBytes = 10 * 1024 * 1024; // 10 MB in bytes

// Function to generate the log file
function generateLogFile() {
  let currentSizeBytes = 0;
  const writeStream = fs.createWriteStream(logFilePath);

  console.log('Generating log file...');

  while (currentSizeBytes < targetSizeBytes) {
    writeStream.write(logEntryTemplate + '\n');
    currentSizeBytes += Buffer.byteLength(logEntryTemplate + '\n', 'utf8');
  }

  writeStream.end();
  console.log(`Log file generated at ${logFilePath} with size ${currentSizeBytes / 1024 / 1024} MB`);
}

// Run the script
generateLogFile();