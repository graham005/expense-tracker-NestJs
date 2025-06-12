import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { Action } from 'src/casl/action.enum';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/dto/create-user.dto';

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('monthly/:year/:month')
  getMonthlyReport(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.reportsService.getMonthlyReport(year, month);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('monthly-summary/:year/:month')
  getMonthlySummary(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.reportsService.getMonthlySummary(year, month);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('yearly/:year')
  getYearlyReport(@Param('year', ParseIntPipe) year: number) {
    return this.reportsService.getYearlyReport(year);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('yearly-summary/:year')
  getYearlySummary(@Param('year', ParseIntPipe) year: number) {
    return this.reportsService.getYearlySummary(year);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('daily/:date')
  getDailyReport(@Param('date') date: string) {
    return this.reportsService.getDailyReport(date);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('daily-summary/:date')
  getDailySummary(@Param('date') date: string) {
    return this.reportsService.getDailySummary(date);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Report'))
  @Get('category/:categoryId')
  getCategoryReport(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.reportsService.getCategoryReport(categoryId);
  }

  @Roles(Role.ADMIN)
  @Get('usage')
  getCategoriesWithUsage() {
    return this.reportsService.getCategoriesWithUsage();
  }
}
