import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async seedUsers() {
        try {
            const userCount = await this.userRepository.count();
            if (userCount > 0) {
                console.log('Users already exist. No need to seed.');
                return;
            }

            const users = Array.from({ length: 100 }, (_, index) => {
                const user = new User();
                user.name = `User ${index + 1}`;
                console.log('User ', user);

                return user;
            });

            await this.userRepository.save(users);
            console.log('100 users added successfully!');
        } catch (error) {
            console.error('Error seeding users:', error);
        }
    }

    async run() {
        await this.seedUsers();
    }
}
