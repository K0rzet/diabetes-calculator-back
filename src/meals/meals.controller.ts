import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe 
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto, CreateFoodTemplateDto } from './dto/meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('meals')
@Controller('meals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MealsController {
  constructor(private mealsService: MealsService) {}

  @Post('template')
  @ApiOperation({ summary: 'Создать шаблон продукта' })
  createFoodTemplate(
    @GetUser('id') userId: number,
    @Body() dto: CreateFoodTemplateDto,
  ) {
    return this.mealsService.createFoodTemplate(userId, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Получить все шаблоны продуктов пользователя' })
  getUserFoodTemplates(@GetUser('id') userId: number) {
    return this.mealsService.getUserFoodTemplates(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Создать прием пищи' })
  createMeal(
    @GetUser('id') userId: number,
    @Body() dto: CreateMealDto,
  ) {
    return this.mealsService.createMeal(userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Получить историю приемов пищи' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  getMealHistory(
    @GetUser('id') userId: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.mealsService.getMealHistory(userId, limit, offset);
  }
}
