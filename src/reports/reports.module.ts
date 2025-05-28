import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Expense } from 'src/expenses/entities/expense.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ Report, Expense])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
