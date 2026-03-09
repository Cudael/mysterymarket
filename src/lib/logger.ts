type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * The active log level, resolved from the LOG_LEVEL environment variable.
 * Defaults to "debug" in development and "info" in production.
 */
const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

/**
 * Structured logger utility. Respects the LOG_LEVEL environment variable.
 * Use this instead of raw `console.log/error/warn` calls throughout the app.
 */
export const logger = {
  /** Logs a debug message (only in non-production environments by default). */
  debug(message: string, context?: LogContext) {
    if (shouldLog("debug")) console.debug(formatMessage("debug", message, context));
  },
  /** Logs an informational message. */
  info(message: string, context?: LogContext) {
    if (shouldLog("info")) console.info(formatMessage("info", message, context));
  },
  /** Logs a warning message. */
  warn(message: string, context?: LogContext) {
    if (shouldLog("warn")) console.warn(formatMessage("warn", message, context));
  },
  /** Logs an error message, optionally including error details. */
  error(message: string, error?: unknown, context?: LogContext) {
    if (shouldLog("error")) {
      const errorInfo =
        error instanceof Error
          ? { errorMessage: error.message, stack: error.stack }
          : { errorMessage: String(error) };
      console.error(formatMessage("error", message, { ...errorInfo, ...context }));
    }
  },
};
