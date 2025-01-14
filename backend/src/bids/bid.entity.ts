import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from '../items/item.entity';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column()
    userId: number;

    @Column('float')
    amount: number;

    @Column('timestamp')
    createdAt: Date;
}
