import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Item } from './items/item.entity';
import { Bid } from './entities/bid.entity';
import { ItemsModule } from './items/items.module';

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
    ItemsModule,
  ],
})
export class AppModule { }
