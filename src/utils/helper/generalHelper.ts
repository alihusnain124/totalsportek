import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function createApiResponse(
  status: HttpStatus,
  message: string,
  exampleData?: string | object,
  exampleErrors?: Record<string, string[]>,
  exampleTrackingNumber?: string,
): ApiResponseOptions {
  return {
    schema: {
      properties: {
        statusCode: { type: 'number', example: status },
        message: { type: 'string', example: message },
        ...(exampleData !== undefined && {
          data: {
            type: typeof exampleData === 'string' ? 'string' : 'object',
            example: exampleData,
          },
        }),
        ...(exampleErrors && {
          errors: {
            type: 'object',
            example: exampleErrors,
          },
        }),
        ...(exampleTrackingNumber && {
          trackingNumber: {
            type: 'string',
            example: exampleTrackingNumber,
          },
        }),
      },
      required: ['message', 'statusCode'],
    },
  };
}

export const formatErrorTitle = (fieldName: string): string => {
  if (!fieldName || typeof fieldName !== 'string') {
    console.warn(`Invalid field name provided to formatErrorTitle: ${fieldName}`);
    return 'Invalid Field';
  }

  return fieldName
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function AtLeastOneLocationField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneLocationField',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const { projectAddress, mapData, customLinks } = args.object as any;
          return !!(projectAddress || mapData?.length > 0 || customLinks?.length > 0);
        },
        defaultMessage() {
          return `At least one of the fields 'projectAddress', 'mapData', or 'customLinks' must be provided. `;
        },
      },
    });
  };
}

export function buildPaginatedResponse<T>(data: T[], { page = 1, limit = 10, total }: PaginationMeta): PaginatedResponse<T> {
  const limitNumber = Number(limit);
  const totalPages = Number(Math.ceil(total / limitNumber));
  const currentPage = Number(page);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    collection: data,
    meta: {
      currentPage: currentPage,
      nextPage: nextPage,
      previousPage: previousPage,
      limit: limitNumber,
      totalCount: total,
      totalPages: totalPages,
    },
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedMetaResponse {
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  collection: T[];
  meta: PaginatedMetaResponse;
}
