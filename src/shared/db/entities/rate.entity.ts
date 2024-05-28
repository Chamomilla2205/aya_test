import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exchange_rates')
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  currency: string;

  @Column('decimal')
  rate: number;
}
