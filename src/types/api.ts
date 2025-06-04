export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  status: 'FAILED';
  message: string;
}

export interface SuccessResponse {
  status: 'SUCCESS';
}
