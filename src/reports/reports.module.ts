import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Expense } from 'src/expenses/entities/expense.entity';
import { User } from 'src/users/entities/user.entity';
import { CaslModule } from 'src/casl/casl.module';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ Report, Expense, User, Category]),
    CaslModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
