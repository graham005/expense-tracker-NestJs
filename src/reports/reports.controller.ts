import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: UpdateReportDto) {
  //   return this.reportsService.update(id, updateReportDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.remove(id);
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
