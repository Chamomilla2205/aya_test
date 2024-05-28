  import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
  import { Employee } from './employee.entity';

  @Entity('donations')
  export class Donation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column('decimal')
    amount: number;

    @Column()
    currency: string;

    @Column({
      nullable: true,
      type: 'decimal'
    })
    amount_in_usd: number;

    @ManyToOne(() => Employee, employee => employee.donations)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;
  }
