import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Item } from './items/item.entity';
import { Bid } from './bids/bid.entity';
import { User } from './users/user.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [User, Item, Bid],
    synchronize: true,
});
