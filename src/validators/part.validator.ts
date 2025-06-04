import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PartType, ConstituentPart } from '../types/part';

export class ConstituentPartDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsEnum(PartType)
  type!: PartType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConstituentPartDto)
  parts?: ConstituentPartDto[];
}

export class AddInventoryDto {
  @IsNumber()
  @Min(1)
  quantity!: number;
}