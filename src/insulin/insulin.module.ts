import { Module } from '@nestjs/common';
import { InsulinService } from './insulin.service';
import { InsulinController } from './insulin.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InsulinController],
  providers: [InsulinService, PrismaService],
})
export class InsulinModule {}
