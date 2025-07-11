import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getDailyReport(date: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { date },
      select: {},
      relations: ['user', 'category'],
    });
  }

  async getDailySummary(date: string) {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.expense_id)', 'totalCount')
      .where('expense.date = :date', { date })
      .getRawOne();

    return {
      date,
      totalAmount: Number(result.totalAmount) || 0,
      totalCount: Number(result.totalCount) || 0,
    };
  }

  async getMonthlyReport(year: number, month: number): Promise<Expense[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .leftJoinAndSelect('expense.category', 'category')
      .select([
        'expense',
        'user.user_id',
        'user.username',
        'user.email',
        'category'
      ])
      .where('EXTRACT(YEAR FROM expense.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM expense.date) = :month', { month })
      .getMany();
  }

  async getMonthlySummary(year: number, month: number) {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.expense_id)', 'totalCount')
      .addSelect('AVG(expense.amount)', 'averageAmount')
      .where('EXTRACT(YEAR FROM expense.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM expense.date) = :month', { month })
      .getRawOne();

    return {
      year,
      month,
      totalAmount: Number(result.totalAmount) || 0,
      totalCount: Number(result.totalCount) || 0,
      averageAmount: Number(result.averageAmount) || 0,
    };
  }

  async getYearlyReport(year: number): Promise<Expense[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .leftJoinAndSelect('expense.category', 'category')
      .select([
        'expense',
        'user.user_id',
        'user.username',
        'user.email',
        'category'
      ])
      .where('EXTRACT(YEAR FROM expense.date) = :year', { year })
      .getMany();
  }

  async getYearlySummary(year: number) {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.expense_id)', 'totalCount')
      .addSelect('AVG(expense.amount)', 'averageAmount')
      .where('EXTRACT(YEAR FROM expense.date) = :year', { year })
      .getRawOne();

    return {
      year,
      totalAmount: Number(result.totalAmount) || 0,
      totalCount: Number(result.totalCount) || 0,
      averageAmount: Number(result.averageAmount) || 0,
    };
  }

  async getCategoryReport(categoryId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { category: { category_id: categoryId}},
      relations: ['user', 'category'],
    })
  }

  getCategoriesWithUsage(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.expenses', 'expense')
      .select([
        'category.category_id AS category_id',
        'category.category_name AS category_name',
        'COUNT(expense.expense_id) AS usage_count'
      ])
      .groupBy('category.category_id')
      .addGroupBy('category.category_name')
      .orderBy('usage_count', 'DESC')
      .getRawMany();
  }
}
