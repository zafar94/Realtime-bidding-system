// src/entities/bid.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Item } from './item.entity';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    amount: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @ManyToOne(() => Item, (item) => item.bids)
    item: Item;
}
