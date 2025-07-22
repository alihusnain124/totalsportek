import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { formatErrorTitle } from 'src/utils/helper/generalHelper';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class FormValidationPipe implements PipeTransform<any> {
  private validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    skipMissingProperties: false,
    enableDebugMessages: true,
    exceptionFactory: (errors) => {
      return this.formatErrors(errors);
    },
  });

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Payload should not be empty');
    }
    if (metadata.type === 'custom' && value.fieldname === 'file' && value.mimetype.split('/').length > 0 && value.buffer) {
      return value;
    }
    if (this.isObj(value) && metadata.type === 'body') {
      value = this.trim(value);
    }
    const transformedValue = plainToClass(metadata.metatype, value);
    const errors = await validate(transformedValue, {
      skipMissingProperties: false,
      forbidNonWhitelisted: true,
      each: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    return this.validationPipe.transform(value, metadata);
  }

  private formatErrors(errors: ValidationError[]): any {
    const result = errors.reduce((acc, error) => {
      this.traverseErrorTree(error, acc);
      return acc;
    }, {});

    const allErrors = Object.values(result).flat();
    const firstError = allErrors[0];
    const additionalErrorsCount = allErrors.length - 1;
    const message = additionalErrorsCount > 0 ? `${firstError} and (${additionalErrorsCount}) more` : firstError;

    return {
      message,
      errors: result,
      statusCode: 400,
    };
  }

  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any) {
    Object.keys(values).forEach((key) => {
      if (this.isObj(values[key])) {
        values[key] = this.trim(values[key]);
      } else {
        if (typeof values[key] === 'string') {
          values[key] = values[key].trim();
        }
      }
    });
    return values;
  }

  private traverseErrorTree(error: ValidationError, result: any, parentKey: string = '') {
    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => this.traverseErrorTree(child, result, `${parentKey}${parentKey ? '.' : ''}${error.property}`));
    } else {
      const propertyKey = parentKey ? `${parentKey}.${error.property}` : error.property;
      const displayName = formatErrorTitle(error.property);
      const constraints = error.constraints;

      if (constraints) {
        result[propertyKey] = Object.values(constraints).map((msg: string) => msg.replace(error.property, displayName));
      }
    }
  }
}
