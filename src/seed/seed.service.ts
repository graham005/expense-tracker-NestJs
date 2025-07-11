import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Role } from 'src/users/dto/create-user.dto';
import * as Bcrypt from 'bcrypt'

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name)
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly dataSource: DataSource  ) {}

    async seed(){
        this.logger.log('Starting seeding process...');

        try {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                await queryRunner.query('DELETE FROM "user"')
                await queryRunner.commitTransaction();
                this.logger.log('Users table cleared successfully.');
            } catch (error) {
                await queryRunner.rollbackTransaction();
                this.logger.error('Error clearing users table:', error);
                throw error;
            } finally {
                await queryRunner.release();
            }

            // Seed the users 
            this.logger.log('Seeding users...');
            const users: User[] = []

            for (let i = 1; i < 20; i++) {
                const user = new User();
                user.username = faker.person.fullName();
                user.email = `user${i}_${faker.internet.email()}`;
                user.password = await this.hashData(faker.internet.password());
                user.role = Role.USER;

                users.push(await this.userRepository.save(user));
                this.logger.log('Users seeded successfully.');

                this.logger.log('Seeding completed successfully.');
            }
        } catch (error) {
            this.logger.error('Error during seeding process:', error);
            throw error;
        }
    }
    private async hashData(data: string): Promise<string> {
            const salt = await Bcrypt.genSalt(10);
            return await Bcrypt.hash(data, salt);
        }
}
