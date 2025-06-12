import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>
  
  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({ where: { category_name: createCategoryDto.category_name } });
    if (existingCategory) {
      throw new Error('Category with this name already exists');

    }
    const newCategory = await this.categoryRepository.create({ ...createCategoryDto})
    await this.categoryRepository.save(newCategory);

    return newCategory;
  }
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    if (categories.length === 0) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { category_id: id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<string | number| void> {
    return await this.categoryRepository.update(id, updateCategoryDto)
      .then((result) => {
        if (result.affected === 0) {
          throw new NotFoundException('Category not found');
        }
      }).catch ((error) => {
        console.error('Error updating category:', error);
        throw new Error(`Error updating category: ${error.message}`);
      })
      .finally(() => {
        return this.findOne(id);
      });
  }

  remove(id: number): Promise<string| void> {
    return this.categoryRepository.delete(id)
      .then((result) => {
        if (result.affected === 0) {
          throw new NotFoundException('Category not found');
        }
      }).catch((error) => {
        console.error('Error deleting category:', error);
        throw new Error(`Error deleting category: ${error.message}`);
      });
  }

  
}
