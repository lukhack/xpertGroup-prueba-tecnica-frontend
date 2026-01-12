/**
 * Generic API Response wrapper
 * All backend endpoints return data in this format
 */
export interface ApiResponse<T> {
  status: string;
  data: T;
}
