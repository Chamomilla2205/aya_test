import { Controller, Get } from "@nestjs/common";
import { EmployeeService } from "./employee.service";

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService
  ) {}

  @Get('reward')
  calculateReward() {
    return this.employeeService.calculateReward()
  }
}