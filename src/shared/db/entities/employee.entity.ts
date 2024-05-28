import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { Statement } from './statement.entity';
import { Donation } from './donations.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;


  @ManyToOne(() => Department, department => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Statement, statement => statement.employee)
  statements: Statement[];

  @OneToMany(() => Donation, donation => donation.employee)
  donations: Donation[];
}
