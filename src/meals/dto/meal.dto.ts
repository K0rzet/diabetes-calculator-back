import { IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMealItemDto {
  @ApiProperty({ description: 'ID шаблона продукта' })
  @IsNumber()
  foodTemplateId: number;

  @ApiProperty({ description: 'Вес продукта в граммах' })
  @IsNumber()
  weight: number;
}

export class CreateMealDto {
  @ApiProperty({ description: 'Название приема пищи' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Список продуктов' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealItemDto)
  items: CreateMealItemDto[];

  @ApiPropertyOptional({ description: 'Заметки к приему пищи' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateFoodTemplateDto {
  @ApiProperty({ description: 'Название продукта' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Количество углеводов на 100г' })
  @IsNumber()
  carbsPer100g: number;

  @ApiPropertyOptional({ description: 'Вес по умолчанию' })
  @IsOptional()
  @IsNumber()
  defaultWeight?: number;
} 