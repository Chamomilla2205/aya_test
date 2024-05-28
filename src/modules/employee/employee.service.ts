import { Injectable } from "@nestjs/common";
import { AppDataSource } from '../../shared/db/data-source'
import { DataSource } from "typeorm";

@Injectable()
export class EmployeeService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
  }

  async calculateReward() {
    const rawQuery = `
      -- calculate amount of the all donations
      WITH total_donations AS (
          SELECT SUM(amount_in_usd) AS total
          FROM donations
      ),
      -- calculate amount of donation per employee who donated more than 100 USD
      eligible_employees AS (
          SELECT employee_id, SUM(amount_in_usd) AS contribution
          FROM donations
          GROUP BY employee_id
          HAVING SUM(amount_in_usd) > 100
      )
      SELECT 
        e.employee_id, 
        CAST(e.contribution AS NUMERIC(8, 3)) AS contribution,
        -- get correct reward based on percentage of contribution
        CAST((e.contribution / td.total) * 10000 AS NUMERIC(8, 3)) AS reward
      FROM eligible_employees e, total_donations td;
    `;
      const result = await this.dataSource.query(rawQuery);
      return result
    }
}