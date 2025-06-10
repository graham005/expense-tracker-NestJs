import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: false,
    description: 'Filter users by role'
  })
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) user_id: number) {
    return this.usersService.findOne(user_id);
  }

  // @Roles(Role.ADMIN, Role.USER)
  // @Patch(':id')
  // changePassword(@Param('id', ParseIntPipe) id: number, @Body() changePasswordDto: ChangePasswordDto){
  //   return this.usersService.changePassword(id, changePasswordDto)
  // }

  @Roles(Role.ADMIN, Role.USER)
  @Patch('/profile/:id')
  update(@Param('id', ParseIntPipe) user_id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(user_id, updateUserDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) user_id: number) {
    return this.usersService.delete(user_id);
  }
}
