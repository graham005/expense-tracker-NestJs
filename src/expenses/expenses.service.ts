import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const user = await this.userRepository.findOne({ where: { user_id: createExpenseDto.user_id}});
    const category = await this.categoryRepository.findOne({ where: { category_id: createExpenseDto.category_id }});

    if (!user || !category) {
      throw new NotFoundException('User or Category not found');
    }

    const newExpense = this.expenseRepository.create({
      amount: createExpenseDto.amount,
      date: createExpenseDto.date,  
      description: createExpenseDto.description,
      user: user,
      category: category,
    });
    return this.expenseRepository.save(newExpense)
  }

  async findAll(): Promise<Expense[] | string>  {
    const expenses = await this.expenseRepository.find({
      relations: ['user', 'category'],
    });

    if (expenses.length === 0) {
      throw new NotFoundException('No expenses found');
    }

    return expenses;
  }

  async findOne(id: number): Promise<Expense | null> {
    const expense = this.expenseRepository.findOne({
      where: { expense_id: id },
      relations: ['user', 'category'],
    });

    if(!expense || expense === null) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const updateExpense: any = {...updateExpenseDto};
  
    if (updateExpenseDto.category_id) {
      updateExpense.category = { category_id: updateExpenseDto.category_id };
      delete updateExpense.category_id;
    }

    await this.expenseRepository.update(id, updateExpense);
    return this.findOne(id);
  }

  remove(id: number) {
    const removeExpense = this.expenseRepository.delete(id)
      .then((result) => {
        if (result.affected === 0) {
          throw new NotFoundException('Expense not found');
        }
        return { message: 'Expense deleted successfully' };
      }).catch((error) => {
        console.error('Error deleting expense:', error);
        throw new Error(`Error deleting expense: ${error.message}`);
      });
    
    return removeExpense;
  }
}
