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

    @Column()
    duration: number;

    @Column('float', { default: 0 })
    highestBid: number;
    
    @Column('timestamp')
    createdAt: Date;

    @Column('bigint')
    endTime: number;
}
