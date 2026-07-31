
export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface DateRange {
  maximum: string;
  minimum: string;
}

export interface TmdbErrorResponse {
  status_code: number;
  status_message: string;
  success: boolean;
}

export interface ApiError {
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'CUSTOM_ERROR';
  message: string;
}
