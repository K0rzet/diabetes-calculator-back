import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateInsulinDto {
  @ApiProperty({ description: 'Текущий уровень сахара' })
  @IsNumber()
  @Min(0)
  currentSugarLevel: number;

  @ApiProperty({ description: 'Количество углеводов' })
  @IsNumber()
  @Min(0)
  carbAmount: number;

  @ApiPropertyOptional({ description: 'Заметки к расчету' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ description: 'Целевой уровень сахара' })
  @IsNumber()
  @Min(0)
  targetSugarLevel: number;

  @ApiProperty({ description: 'Фактор чувствительности к инсулину' })
  @IsNumber()
  @Min(0)
  insulinSensitivityFactor: number;

  @ApiProperty({ description: 'Углеводный коэффициент' })
  @IsNumber()
  @Min(0)
  carbRatio: number;
} 