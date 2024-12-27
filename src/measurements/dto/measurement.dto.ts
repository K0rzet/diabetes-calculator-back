import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MeasurementStatus {
  BEFORE_MEAL = 'before_meal',
  AFTER_MEAL = 'after_meal',
  BEFORE_SLEEP = 'before_sleep',
  FASTING = 'fasting',
  OTHER = 'other'
}

export class CreateMeasurementDto {
  @ApiProperty({ description: 'Уровень сахара в крови' })
  @IsNumber()
  sugarLevel: number;

  @ApiProperty({ 
    enum: MeasurementStatus,
    description: 'Когда было сделано измерение' 
  })
  @IsEnum(MeasurementStatus)
  status: MeasurementStatus;

  @ApiPropertyOptional({ description: 'Заметки к измерению' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Самочувствие' })
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional({ description: 'Количество введенного инсулина' })
  @IsOptional()
  @IsNumber()
  insulin?: number;
} 