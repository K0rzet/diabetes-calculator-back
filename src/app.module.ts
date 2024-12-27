import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { InsulinModule } from './insulin/insulin.module'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MealsModule } from './meals/meals.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config'

@Module({
	imports: [
		InsulinModule,
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),
		MealsModule,
		MeasurementsModule,
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getGoogleRecaptchaConfig,
			inject: [ConfigService]
		}),
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule { }
