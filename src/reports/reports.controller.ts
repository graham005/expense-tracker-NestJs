import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly/:year/:month')
  getMonthlyReport(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.reportsService.getMonthlyReport(year, month);
  }

  @Get('yearly/:year')
  getYearlyReport(@Param('year', ParseIntPipe) year: number) {
    return this.reportsService.getYearlyReport(year);
  }

  @Get('daily/:date')
  getDailyReport(@Param('date') date: string) {
    return this.reportsService.getDailyReport(date);
  }

  @Get('category/:categoryId')
  getCategoryReport(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.reportsService.getCategoryReport(categoryId);
  }
}
