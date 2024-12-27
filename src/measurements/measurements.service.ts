import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class MeasurementsService {
  constructor(private prisma: PrismaService) {}

  // Создание нового измерения
  async createMeasurement(userId: number, dto: CreateMeasurementDto) {
    return this.prisma.sugarMeasurement.create({
      data: {
        userId,
        ...dto
      }
    });
  }

  // Получение измерений за день
  async getDailyMeasurements(userId: number, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return this.prisma.sugarMeasurement.findMany({
      where: {
        userId,
        datetime: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        datetime: 'asc'
      }
    });
  }

  // Получение статистики за период
  async getStatistics(userId: number, days: number) {
    const startDate = subDays(new Date(), days);

    const measurements = await this.prisma.sugarMeasurement.findMany({
      where: {
        userId,
        datetime: {
          gte: startDate
        }
      }
    });

    const stats = {
      average: 0,
      min: 0,
      max: 0,
      inTargetRange: 0,
      total: measurements.length,
      byStatus: {} as Record<string, number[]>
    };

    if (measurements.length > 0) {
      // Расчет статистики
      stats.average = this.calculateAverage(measurements);
      stats.min = Math.min(...measurements.map(m => m.sugarLevel));
      stats.max = Math.max(...measurements.map(m => m.sugarLevel));
      stats.inTargetRange = this.calculateInTargetRange(measurements);
      stats.byStatus = this.groupByStatus(measurements);
    }

    return stats;
  }

  // Получение последних измерений
  async getRecentMeasurements(userId: number, limit: number = 10) {
    return this.prisma.sugarMeasurement.findMany({
      where: { userId },
      orderBy: { datetime: 'desc' },
      take: limit
    });
  }

  private calculateAverage(measurements: any[]): number {
    return measurements.reduce((sum, m) => sum + m.sugarLevel, 0) / measurements.length;
  }

  private calculateInTargetRange(measurements: any[]): number {
    const inRange = measurements.filter(m => m.sugarLevel >= 4 && m.sugarLevel <= 10);
    return (inRange.length / measurements.length) * 100;
  }

  private groupByStatus(measurements: any[]): Record<string, number[]> {
    return measurements.reduce((acc, m) => {
      if (!acc[m.status]) {
        acc[m.status] = [];
      }
      acc[m.status].push(m.sugarLevel);
      return acc;
    }, {});
  }
}
