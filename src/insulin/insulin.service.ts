import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CalculateInsulinDto, UpdateUserSettingsDto } from './dto/calculate-insulin.dto'

@Injectable()
export class InsulinService {
	constructor(private prisma: PrismaService) {}

	async calculateInsulin(userId: number, dto: CalculateInsulinDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId }
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const correctionDose = Math.max(
			0,
			(dto.currentSugarLevel - user.targetSugarLevel) /
				user.insulinSensitivityFactor
		)

		const mealDose = dto.carbAmount / user.carbRatio
		const totalDose = Number((correctionDose + mealDose).toFixed(1))

		return this.prisma.insulinCalculation.create({
			data: {
				userId,
				currentSugarLevel: dto.currentSugarLevel,
				targetSugarLevel: user.targetSugarLevel,
				carbAmount: dto.carbAmount,
				correctionDose: Number(correctionDose.toFixed(1)),
				mealDose: Number(mealDose.toFixed(1)),
				totalDose,
				notes: dto.notes,
			}
		})
	}

	async getUserSettings(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				targetSugarLevel: true,
				insulinSensitivityFactor: true,
				carbRatio: true,
			}
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async updateUserSettings(userId: number, dto: UpdateUserSettingsDto) {
		return this.prisma.user.update({
			where: { id: userId },
			data: dto,
			select: {
				targetSugarLevel: true,
				insulinSensitivityFactor: true,
				carbRatio: true,
			}
		})
	}

	async getCalculationHistory(userId: number, limit = 10, offset = 0) {
		const [calculations, total] = await Promise.all([
			this.prisma.insulinCalculation.findMany({
				where: { userId },
				orderBy: { createdAt: 'desc' },
				take: limit,
				skip: offset,
			}),
			this.prisma.insulinCalculation.count({
				where: { userId },
			})
		])

		return {
			calculations,
			total,
			limit,
			offset,
		}
	}
}
