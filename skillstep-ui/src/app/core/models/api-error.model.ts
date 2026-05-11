// src/app/core/models/api-error.model.ts
export interface FieldError {
  field: string;
  rejectedValue: unknown;
  message: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  errors: FieldError[];
}