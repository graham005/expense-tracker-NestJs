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
    private reportRepository: Repository<Report>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const newReport = this.reportRepository.create({
      ...createReportDto,
    });
    return this.reportRepository.save(newReport);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find();
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
      relations: ['user', 'category'],
    });
  }

  async getCategoryReport(categoryId: number) {
    return this.expenseRepository.find({
      where: { category: { category_id: categoryId}},
      relations: ['user', 'category'],
    })
  }
}
