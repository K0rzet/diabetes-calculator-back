import { 
  Controller, 
  Post, 
  Get, 
  Put,
  Body, 
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe 
} from '@nestjs/common';
import { InsulinService } from './insulin.service';
import { CalculateInsulinDto, UpdateUserSettingsDto } from './dto/calculate-insulin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('insulin')
@Controller('insulin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InsulinController {
  constructor(private insulinService: InsulinService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Рассчитать дозу инсулина' })
  calculateInsulin(
    @GetUser('id') userId: number,
    @Body() dto: CalculateInsulinDto,
  ) {
    return this.insulinService.calculateInsulin(userId, dto);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Получить настройки пользователя' })
  getUserSettings(@GetUser('id') userId: number) {
    return this.insulinService.getUserSettings(userId);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Обновить настройки пользователя' })
  updateUserSettings(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserSettingsDto,
  ) {
    return this.insulinService.updateUserSettings(userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Получить историю расчетов' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  getCalculationHistory(
    @GetUser('id') userId: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.insulinService.getCalculationHistory(userId, limit, offset);
  }
}
