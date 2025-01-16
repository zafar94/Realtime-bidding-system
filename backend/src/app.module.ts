import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuctionGateway } from './auction/auction.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ItemsModule,
    BidsModule,
  ],
  providers: [AuctionGateway],
})
export class AppModule { }
