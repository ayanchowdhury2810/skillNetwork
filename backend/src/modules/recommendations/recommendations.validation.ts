import type { PaginationParams } from "./recommendations.types.js";

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePagination = (
  page: unknown,
  limit: unknown
): { params: PaginationParams; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  let parsedPage = 1;
  let parsedLimit = 20;

  if (page !== undefined && page !== null && page !== "") {
    const num = Number(page);
    if (isNaN(num) || num < 1) {
      errors.push({
        field: "page",
        message: "page must be a number >= 1",
      });
    } else {
      parsedPage = num;
    }
  }

  if (limit !== undefined && limit !== null && limit !== "") {
    const num = Number(limit);
    if (isNaN(num) || num < 1) {
      errors.push({
        field: "limit",
        message: "limit must be a number >= 1",
      });
    } else if (num > 50) {
      errors.push({
        field: "limit",
        message: "limit must be <= 50",
      });
    } else {
      parsedLimit = num;
    }
  }

  return {
    params: { page: parsedPage, limit: parsedLimit },
    errors,
  };
};
