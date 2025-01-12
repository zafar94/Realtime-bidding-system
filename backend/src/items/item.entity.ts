import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('float')
    startingPrice: number;

    @Column('timestamp')
    auctionEndTime: Date;

    @Column('float', { default: 0 })
    highestBid: number;
    
    @Column('timestamp')
    createdAt: Date;
}
