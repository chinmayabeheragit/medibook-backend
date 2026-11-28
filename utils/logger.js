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
              target: "pino-roll",
              options: {
                file: join(process.cwd(), "logs", "core-service.log"),
                frequency: "daily",
                mkdir: true,
                limit: { count: 30 }, // keep 30 days
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
