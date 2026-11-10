/**
 * Cartlight: ChatGPT Ads HQ
 * Server Response & Error Handling Utilities
 * Cartlight Labs (c) 2026.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function jsonSuccess<T>(data: T, status = 200): Response {
  const payload: ApiResponse<T> = { success: true, data };
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function jsonError(message: string, code = "INTERNAL_ERROR", status = 500, details?: unknown): Response {
  const payload: ApiResponse = {
    success: false,
    error: { code, message, details },
  };
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
