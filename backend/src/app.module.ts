import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Item } from './entities/item.entity';
import { Bid } from './entities/bid.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'bidding',
      entities: [User, Item, Bid],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Item, Bid]),
  ],
})
export class AppModule { }
