import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError as AppValidationError } from '../errors/app.error';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  obj: any
): Promise<T> {
  const dto = plainToClass(dtoClass, obj);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const errorMessages = errors.map(error => {
      return Object.values(error.constraints || {}).join(', ');
    }).join('; ');
    
    throw new AppValidationError(`Validation failed: ${errorMessages}`);
  }

  return dto;
}