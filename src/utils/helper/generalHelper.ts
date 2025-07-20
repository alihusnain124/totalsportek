import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

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
    console.warn(
      `Invalid field name provided to formatErrorTitle: ${fieldName}`,
    );
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
          return !!(
            projectAddress ||
            mapData?.length > 0 ||
            customLinks?.length > 0
          );
        },
        defaultMessage() {
          return `At least one of the fields 'projectAddress', 'mapData', or 'customLinks' must be provided. `;
        },
      },
    });
  };
}
