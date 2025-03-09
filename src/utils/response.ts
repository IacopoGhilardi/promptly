import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export enum ResponseStatus {
  OK = 'OK',
  KO = 'KO'
}

export interface ApiResponse<T> {
  status: ResponseStatus;
  data?: T;
  error?: string;
  message?: string;
}

export function jsonResponse<T>(
  c: Context,
  status: ResponseStatus,
  options: { 
    data?: T;
    error?: string;
    message?: string;
    statusCode?: ContentfulStatusCode;
  } = {}
) {
  const { data, error, message, statusCode = status === ResponseStatus.OK ? 200 : 400 } = options;

  const response: ApiResponse<T> = {
    status,
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message }),
  };
  
  return c.json(response, statusCode);
}