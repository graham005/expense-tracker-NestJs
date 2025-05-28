import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = []
  findAll(role?: 'USER'| 'ADMIN') {
        if(role) {
           const rolesArray =  this.users.filter(user => user.role === role)
           if(rolesArray.length === 0) throw new NotFoundException ('User Role Not Found')
            return rolesArray
        }
        return this.users
    }

    findOne(id: number) {
        const user = this.users.find(user => user.user_id === id)

        if(!user) throw new NotFoundException('User not found')

        return user
    }

    create(createUserDto: CreateUserDto) {
        const usersByHighestId = [...this.users].sort((a, b) => b.user_id - a.user_id)
        const newUser = {
            user_id: usersByHighestId.length > 0 ? usersByHighestId[0].user_id + 1 : 1,
            created_at: new Date(),
            updated_at: new Date(),
            ...createUserDto,
        }
        this.users.push(newUser)
        return newUser
    }

    update ( id: number, updateUserDto: UpdateUserDto) {
        this.users = this.users.map(user =>  {
            if (user.user_id === id) {
                return {...user, ...updateUserDto}
            }
            return user
        })

        return this.findOne(id)
    }

    delete(id: number) {
        const removeUser = this.findOne(id)
        
        this.users = this.users.filter(user => user.user_id !== id)

        return removeUser
    }
}
