export interface ApiResponse<T = undefined> {
  error: boolean;
  statusCode: number;
  message: string;
  module: string;
  data?: T;
}

export class ApiErrorResponse<T = undefined> implements ApiResponse<T> {
  error = true;

  constructor(
    public statusCode: number,
    public message: string,
    public module: string,
    public data?: T
  ) {}
}

export class ApiSuccessResponse<T = undefined> implements ApiResponse<T> {
  error = false;

  constructor(
    public statusCode: number,
    public message: string,
    public module: string,
    public data?: T
  ) {}
}
