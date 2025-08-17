import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class FileExistValidator implements ValidatorConstraintInterface {
  validate(file: any): boolean {
    return file && typeof file === 'object';
  }
}
export function FileExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: FileExistValidator,
    });
  };
}
