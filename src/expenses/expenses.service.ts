import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  private expenses: Expense[] = [];
  create(createExpenseDto: CreateExpenseDto) {
    const expenseByHighestId = [...this.expenses].sort((a, b) => b.expense_id - a.expense_id);
    const newExpense: Expense = {
      expense_id: expenseByHighestId.length > 0 ? expenseByHighestId[0].expense_id + 1 : 1,
      created_at: new Date(), 
      updated_at: new Date(), 
      ...createExpenseDto,
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  findAll() {
    return this.expenses;
  }

  findOne(id: number) {
    const expense = this.expenses.find(expense => expense.expense_id === id)

    if(!expense) throw new NotFoundException('Expense not found')
    return expense;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    this.expenses= this.expenses.map(expense => {
      if(expense.expense_id === id) {
        return {...expense, ...updateExpenseDto}
      }
      return expense;
    });
    return this.findOne(id);
  }

  remove(id: number) {
    const removeExpense = this.findOne(id)

    this.expenses = this.expenses.filter(expense => expense.expense_id !== id)
    
    return removeExpense;
  }
}
