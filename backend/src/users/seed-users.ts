import { AppDataSource } from './../data-source';
import { User } from './user.entity';

const seedUsers = async () => {
    try {
        const dataSource = await AppDataSource.initialize();
        console.log('Database connected successfully!');

        const userCount = await dataSource.getRepository(User).count();
        if (userCount > 0) {
            console.log('Users already exist. No need to seed.');
            process.exit(0);
        }

        const users = Array.from({ length: 100 }, (_, index) => {
            const user = new User();
            user.name = `User ${index + 1}`;
            console.log('User:', user);
            return user;
        });

        await dataSource.getRepository(User).save(users);
        console.log('100 users added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
