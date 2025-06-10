import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from 'src/expenses/entities/expense.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const newReport = this.reportRepository.create({
      ...createReportDto,
    });
    return this.reportRepository.save(newReport);
  }

  async findAll(): Promise<Report[]> {
    const newReport = await this.reportRepository.find();
    if (newReport.length === 0) {
      throw new NotFoundException('No report found');
    }
    return newReport
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { report_id: id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  // async update(id: number, updateReportDto: UpdateReportDto): Promise<Report> {
  //   const report = await this.findOne(id);
  //   Object.assign(report, updateReportDto);
  //   return this.reportRepository.save(report);
  // }

  async remove(id: number): Promise<Report> {
    const report = await this.findOne(id);
    await this.reportRepository.delete(id);
    return report;
  }

  async getDailyReport(date: string) {
    return this.expenseRepository.find({
      where: { date },
      select: {
        
      },
      relations: ['user', 'category'],
    });
  }

  async getMonthlyReport(year: number, month: number) {
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

  async getYearlyReport(year: number) {
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

  async getCategoryReport(categoryId: number) {
    return this.expenseRepository.find({
      where: { category: { category_id: categoryId}},
      relations: ['user', 'category'],
    })
  }
}
