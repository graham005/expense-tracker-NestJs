import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ){}
    async findAll(role?: Role) {
        if(role) {
           const rolesArray =  await this.userRepository.find({ where: { role } });
           if(rolesArray.length === 0) throw new NotFoundException ('User Role Not Found')
            return rolesArray
        }
        return this.userRepository.find();
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({where: { user_id: id}})

        if(!user) throw new NotFoundException('User not found')

        return user
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const newUser = await this.userRepository.create({...createUserDto})
        await this.userRepository.save(newUser)
      
        return newUser
    }

    async updateProfile ( id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepository.update(id, updateUserDto).
        then((result) => {
            if (result.affected === 0) {
                return new NotFoundException('User not found');
            }
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            throw new Error(`Error updating user: ${error.message}`);
        }).finally (() => {
            return this.findOne(id);
        });
    }

    delete(id: number) {
        return this.userRepository.delete(id)
            .then((result) => {
                if (result.affected === 0) {
                    throw new NotFoundException('User not found');
                }
                return { message: 'User deleted successfully' };
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                throw new Error(`Error deleting user: ${error.message}`);
            });
    }
}
