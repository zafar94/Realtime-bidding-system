// src/entities/item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bid } from './bid.entity';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
‰
    @Column('decimal')
    startingPrice: number;

    @Column('timestamp')
    endTime: Date;

    @OneToMany(() => Bid, (bid) => bid.item)
    bids: Bid[];
}
