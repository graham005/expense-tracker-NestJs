import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}

    // Hash password using bcrypt
    private async hashData(data: string): Promise<string> {
        const salt = await Bcrypt.genSalt(10);
        return await Bcrypt.hash(data, salt);
    }

    // Helper method to remove password from User
    private excludePassword(user: User): Partial<User> {
        const { password, hashedRefreshToken, ...rest} = user;
        return rest;
    }
    async findAll(role?: Role): Promise<Partial<User>[]> {
        let users: User[];
        if(role) {
           const rolesArray =  await this.userRepository.find({ where: { role } });
           if(rolesArray.length === 0 || rolesArray === null) throw new NotFoundException ('User Role Not Found')
            return rolesArray
        }
        users = await this.userRepository.find();

        return users.map(user => this.excludePassword(user));
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({where: { user_id: id}})

        if(!user) throw new NotFoundException('User not found')

        return user
    }

    async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const newUser = await this.userRepository.create({
            username: createUserDto.username,
            email: createUserDto.email,
            password: await this.hashData(createUserDto.password),
            role: createUserDto.role || 'USER'
            })

        const savedUser = await this.userRepository
            .save(newUser)
            .then((user) => {
                return user;
            })
            .catch((error) => {
                console.error('Error creating user:', error);
                throw new Error('Failed to ctreate user');
            });
        return this.excludePassword(savedUser);
    }

    async updateProfile ( id: number, updateUserDto: UpdateUserDto): Promise<Partial<User> | string> {
        if (updateUserDto.password) {
            updateUserDto.password = await this.hashData(updateUserDto.password);
        }
        await this.userRepository.update(id, updateUserDto);

        return await this.findOne(id);
    }

    // async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<Partial<User> | {message: string}>{
    //     changePasswordDto.password = await this.hashData(changePasswordDto.password)
    //     await this.userRepository.update(id, changePasswordDto);

    //     return { message: 'Password changed successfully'}
    // }

    delete(id: number): Promise<string | { message: string }> {
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
