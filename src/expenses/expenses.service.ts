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

  async create(createExpenseDto: CreateExpenseDto, user: any) {
    const foundUser = await this.userRepository.findOne({ where: { user_id: user.user_id}});
    const category = await this.categoryRepository.findOne({ where: { category_id: createExpenseDto.category_id }});

    if (!foundUser || !category) {
      throw new NotFoundException('User or Category not found');
    }

    const newExpense = this.expenseRepository.create({
      amount: createExpenseDto.amount,
      date: createExpenseDto.date,  
      description: createExpenseDto.description,
      user: foundUser,
      category: category,
    });
    return this.expenseRepository.save(newExpense)
  }

  async findAll(user: any): Promise<Expense[] | string>  {
    const expenses = await this.expenseRepository.find({
      where: { user: { user_id: user.user_id } },
      relations: ['user', 'category'],
    });

    if (expenses.length === 0) {
      throw new NotFoundException('No expenses found');
    }

    return expenses;
  }

  async findOne(id: number, user): Promise<Expense | null> {
    const expense = this.expenseRepository.findOne({
      where: { expense_id: id, user: {user_id: user.user_id} },
      relations: ['user', 'category'],
    });

    if(!expense || expense === null) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, user) {
    const updateExpense: any = {...updateExpenseDto};
  
    if (updateExpenseDto.category_id) {
      updateExpense.category = { category_id: updateExpenseDto.category_id };
      delete updateExpense.category_id;
    }

    await this.expenseRepository.update(id, updateExpense);
    return this.findOne(id, user);
  }

  async remove(id: number, user: any) {
    const result = await this.expenseRepository.delete({ expense_id: id, user: { user_id: user.user_id } });
  
    if (result.affected === 0) {
      throw new NotFoundException('Expense not found');
    }
  
    return { message: 'Expense deleted successfully' };
  }
}
