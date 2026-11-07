import pino from "pino";
import { join } from "path";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
        targets: [
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          },
          {
            target: "pino/file",
            options: {
              destination: join(process.cwd(), "logs", "core-service.log"),
              mkdir: true,
            },
          },
        ],
      }
      : undefined,
  base: {
    service: "medibook-core-service",
    env: process.env.NODE_ENV || "development",
  },
});

export default logger;