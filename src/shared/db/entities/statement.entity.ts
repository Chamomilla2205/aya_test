import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('statements')
export class Statement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Employee, employee => employee.statements)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
