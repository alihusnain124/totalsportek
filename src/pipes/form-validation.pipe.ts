import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { formatErrorTitle } from '../utils/helper/generalHelper';

@Injectable()
export class FormValidationPipe implements PipeTransform<any> {
  private validationPipe = new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = {};

      const processErrors = (error, propertyPath) => {
        const fieldName = propertyPath
          ? propertyPath.split('.').pop()
          : 'Unknown Field';
        if (!fieldName || typeof fieldName !== 'string') {
          console.error(
            `Invalid field name detected: ${fieldName}, propertyPath: ${propertyPath}`,
          );
        }

        const displayName = formatErrorTitle(fieldName);
        const constraints = error.constraints || {};

        const prioritizedConstraints = [
          'isNotEmpty',
          'isEmail',
          'matches',
          'isPhoneNumber',
          'isBoolean',
          'isEnum',
          'isUrl',
          'atLeastOneLocationField',
        ];

        for (const key of prioritizedConstraints) {
          if (constraints[key]) {
            result[propertyPath] = result[propertyPath] || [];
            result[propertyPath].push(
              constraints[key].replace(fieldName, displayName),
            );
            break;
          }
        }

        if (error.children && error.children.length) {
          error.children.forEach((childError) => {
            const childPropertyPath = propertyPath
              ? `${propertyPath}.${childError.property}`
              : childError.property;
            processErrors(childError, childPropertyPath);
          });
        }
      };

      errors.forEach((error) => {
        processErrors(error, error.property);
      });

      const formErrors = Object.values(result).flat();
      const uniqueErrorCount = Object.keys(result).length;

      return new BadRequestException({
        errors: result,
        error: 'Bad Request',
        message:
          formErrors.length > 1
            ? `${formErrors[0]} and (${uniqueErrorCount - 1}) more`
            : `${formErrors[0]}`,
        statusCode: 400,
      });
    },
  });

  async transform(value: any, metadata: ArgumentMetadata) {
    return this.validationPipe.transform(value, metadata);
  }
}
