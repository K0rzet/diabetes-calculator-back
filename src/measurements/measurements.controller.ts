import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/measurement.dto';

@ApiTags('measurements')
@Controller('measurements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeasurementsController {
  constructor(private measurementsService: MeasurementsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое измерение сахара' })
  createMeasurement(
    @GetUser('id') userId: number,
    @Body() dto: CreateMeasurementDto,
  ) {
    return this.measurementsService.createMeasurement(userId, dto);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Получить измерения за день' })
  @ApiQuery({ name: 'date', required: false })
  getDailyMeasurements(
    @GetUser('id') userId: number,
    @Query('date') dateString?: string,
  ) {
    const date = dateString ? new Date(dateString) : new Date();
    return this.measurementsService.getDailyMeasurements(userId, date);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получить статистику измерений' })
  @ApiQuery({ name: 'days', required: false })
  getStatistics(
    @GetUser('id') userId: number,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.measurementsService.getStatistics(userId, days);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Получить последние измерения' })
  @ApiQuery({ name: 'limit', required: false })
  getRecentMeasurements(
    @GetUser('id') userId: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.measurementsService.getRecentMeasurements(userId, limit);
  }
}
