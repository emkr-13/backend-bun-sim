import pino from "pino";
import path from "path";
import { createStream } from "rotating-file-stream";
import { multistream } from "pino-multi-stream";

// Helper function for formatting date
const pad = (num: number) => (num > 9 ? "" : "0") + num;

// Create a rotating log stream
const logDirectory = path.join(process.cwd(), "logs"); // Directory to store logs

const logStream = createStream(
  () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `app-${year}-${month}-${day}.log`;
  },
  {
    interval: "1d", // Rotate logs daily
    path: logDirectory, // Directory to store logs
  }
);

// Combine console and file streams using pino-multi-stream
const streams = [
  { stream: process.stdout }, // Log to console
  { stream: logStream }, // Log to file
];

// Create a Pino logger instance with multi-stream
const logger = pino(
  {
    level: "info", // Default log level
    base: null, // Disable default metadata (hostname, pid)
    timestamp: () => `,"time":"${new Date().toISOString()}"`, // Customize timestamp
  },
  multistream(streams) // Use multistream to combine streams
);

export default logger;
