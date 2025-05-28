import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = []
  create(createCategoryDto: CreateCategoryDto) {
    const categoryByHighestId = [...this.categories].sort((a, b) => b.category_id - a.category_id);
    const newCategory = {
            category_id: categoryByHighestId.length > 0 ? categoryByHighestId[0].category_id + 1 : 1,
            created_at: new Date,
            ...createCategoryDto,
        }
        this.categories.push(newCategory)
        return newCategory
    }

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    const category = this.categories.find(category => category.category_id === id);

    if (!category) throw new NotFoundException('Category not found')
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    this.categories = this.categories.map(category => {
      if (category.category_id === id){
        return{
          ...category,
          ...updateCategoryDto
        }
      }
      return category;
    })
    return this.findOne(id)
  }

  remove(id: number) {
    const removeCategory = this.findOne(id)

    this.categories = this.categories.filter(category => category.category_id !== id)

    return removeCategory;
  }
}
