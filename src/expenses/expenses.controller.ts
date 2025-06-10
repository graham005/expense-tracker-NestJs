import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User as UserDecorator} from 'src/auth/decorators/user.decorator'

@Controller('expenses')
@UseGuards(RolesGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Roles(Role.USER)
  @Post()
  create(
    @UserDecorator() user: any,
    @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Roles(Role.USER)
  @Get()
  findAll(@UserDecorator() user: any) {
    return this.expensesService.findAll(user);
  }

  @Roles(Role.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserDecorator() user: any) {
    return this.expensesService.findOne(id, user);
  }

  @Roles(Role.USER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateExpenseDto: UpdateExpenseDto, 
    @UserDecorator() user: any) {
    return this.expensesService.update(id, updateExpenseDto, user);
  }

  @Roles(Role.USER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe,) id: number, @UserDecorator() user: any) {
    return this.expensesService.remove(id, user);
  }
}
