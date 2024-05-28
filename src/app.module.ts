import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statement, Department, Donation, Employee, Rate } from '././shared/db/entities/';
import { AppDataSource } from './shared/db/data-source';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options
    }),
    TypeOrmModule.forFeature([Employee, Department, Statement, Donation]),
    EmployeeModule
  ],
})
export class AppModule {}
