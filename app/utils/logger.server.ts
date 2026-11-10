/**
 * Cartlight: ChatGPT Ads HQ
 * Structured Logging Utility
 * Cartlight Labs (c) 2026.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  shop?: string;
  requestId?: string;
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context && Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [Cartlight:${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage("debug", message, context));
    }
  },

  info(message: string, context?: LogContext) {
    console.info(formatMessage("info", message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage("warn", message, context));
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errorDetails = error instanceof Error ? { errorName: error.name, errorMsg: error.message, stack: error.stack } : { rawError: error };
    console.error(formatMessage("error", message, { ...context, ...errorDetails }));
  },
};
