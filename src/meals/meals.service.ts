import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto, CreateFoodTemplateDto } from './dto/meal.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  async createFoodTemplate(userId: number, dto: CreateFoodTemplateDto) {
    return this.prisma.foodTemplate.create({
      data: {
        userId,
        name: dto.name,
        carbsPer100g: dto.carbsPer100g,
        defaultWeight: dto.defaultWeight || 100,
      },
    });
  }

  async createMeal(userId: number, dto: CreateMealDto) {
    // Подсчитываем общее количество углеводов
    let totalCarbs = 0;
    const mealItemsData = [];

    for (const item of dto.items) {
      const template = await this.prisma.foodTemplate.findUnique({
        where: { id: item.foodTemplateId },
      });

      if (!template) {
        throw new NotFoundException(
          `Food template with id ${item.foodTemplateId} not found`,
        );
      }

      const carbAmount = (template.carbsPer100g * item.weight) / 100;
      totalCarbs += carbAmount;

      mealItemsData.push({
        foodTemplateId: item.foodTemplateId,
        weight: item.weight,
        carbAmount,
      });
    }

    return this.prisma.meal.create({
      data: {
        userId,
        name: dto.name,
        totalCarbs,
        notes: dto.notes,
        mealItems: {
          create: mealItemsData,
        },
      },
      include: {
        mealItems: {
          include: {
            foodTemplate: true,
          },
        },
      },
    });
  }

  async getUserFoodTemplates(userId: number) {
    return this.prisma.foodTemplate.findMany({
      where: { userId },
    });
  }

  async getMealHistory(
    userId: number,
    limit = 10,
    offset = 0,
  ) {
    const [meals, total] = await Promise.all([
      this.prisma.meal.findMany({
        where: { userId },
        include: {
          mealItems: {
            include: {
              foodTemplate: true,
            },
          },
        },
        orderBy: { dateTime: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.meal.count({
        where: { userId },
      }),
    ]);

    return {
      meals,
      total,
      limit,
      offset,
    };
  }
}
