import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('role') role: 'USER' | 'ADMIN') {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) user_id: number) {
    return this.usersService.findOne(user_id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) user_id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user_id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) user_id: number) {
    return this.usersService.delete(user_id);
  }
}
