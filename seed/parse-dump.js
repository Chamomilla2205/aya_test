const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '../dump.txt'); // Adjust the path if needed
const outputFilePath = path.join(__dirname, '../dump.sql');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  const lines = data.split('\n');
  let sqlStatements = [];
  let currentEmployee = null;
  let currentDepartment = null;
  let currentStatement = null;
  let currentDonation = null;
  let currentRate = null;
  let departmentValues = [];
  let employeeValues = [];
  let statementValues = [];
  let donationValues = [];
  let exchangeRateValues = [];

  const escapeString = (str) => str.replace(/'/g, "''");

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('Employee')) {
      if (currentEmployee) {
        employeeValues.push(`(${currentEmployee.id}, '${escapeString(currentEmployee.first_name)}', '${escapeString(currentEmployee.last_name)}', ${currentEmployee.department_id})`);
        for (let salary of currentEmployee.salaries) {
          statementValues.push(`(${salary.id}, ${currentEmployee.id}, ${salary.amount}, '${salary.date}')`);
        }
        for (let donation of currentEmployee.donations) {
          donationValues.push(`(${donation.id}, ${currentEmployee.id}, ${donation.amount.split(' ')[0]}, '${donation.amount.split(' ')[1]}', '${donation.date}')`);
        }
      }
      currentEmployee = { salaries: [], donations: [] };
    } else if (line.startsWith('id:')) {
      const id = line.split(':')[1].trim();
      if (currentEmployee && !currentEmployee.id) {
        currentEmployee.id = id;
      } else if (currentDepartment && !currentDepartment.id) {
        currentDepartment.id = id;
      } else if (currentStatement) {
        currentStatement.id = id;
      } else if (currentDonation) {
        currentDonation.id = id;
      } else if (currentRate) {
        currentRate.id = id;
      }
    } else if (line.startsWith('name:')) {
      const name = line.split(':')[1].trim();
      if (currentEmployee && !currentEmployee.first_name) {
        currentEmployee.first_name = name;
      } else if (currentDepartment) {
        currentDepartment.name = name;
      }
    } else if (line.startsWith('surname:')) {
      currentEmployee.last_name = line.split(':')[1].trim();
    } else if (line.startsWith('Department')) {
      currentDepartment = {};
    } else if (line.startsWith('Statement')) {
      currentStatement = { type: 'salary' };
    } else if (line.startsWith('Donation')) {
      currentDonation = {};
    } else if (line.startsWith('Rate') && !line.startsWith('Rates')) {
      currentRate = { type: 'exchange_rate' };
    } else if (line.startsWith('amount:')) {
      if (currentStatement) {
        currentStatement.amount = line.split(':')[1].trim();
      } else if (currentDonation) {
        currentDonation.amount = line.split(':')[1].trim();
      } else if (currentRate) {
        currentRate.amount = line.split(':')[1].trim();
      }
    } else if (line.startsWith('value:')) {
      if (currentRate) {
        currentRate.amount = line.split(':')[1].trim();
      }
    } else if (line.startsWith('date:')) {
      if (currentStatement) {
        currentStatement.date = line.split(':')[1].trim();
      } else if (currentDonation) {
        currentDonation.date = line.split(':')[1].trim();
      } else if (currentRate) {
        currentRate.date = line.split(':')[1].trim();
      }
    } else if (line.startsWith('sign:')) {
      if (currentRate) {
        currentRate.currency = line.split(':')[1].trim();
      }
    } else if (line === '') {
      if (currentStatement) {
        currentEmployee.salaries.push(currentStatement);
        currentStatement = null;
      } else if (currentDonation) {
        currentEmployee.donations.push(currentDonation);
        currentDonation = null;
      } else if (currentDepartment) {
        departmentValues.push(`(${currentDepartment.id}, '${escapeString(currentDepartment.name)}')`);
        currentEmployee.department_id = currentDepartment.id;
        currentDepartment = null;
      } else if (currentRate) {
        exchangeRateValues.push(`('${currentRate.date}', '${currentRate.currency}', ${currentRate.amount})`);
        currentRate = null;
      }
    }
  }

  // Write the remaining current employee if exists
  if (currentEmployee) {
    employeeValues.push(`(${currentEmployee.id}, '${escapeString(currentEmployee.first_name)}', '${escapeString(currentEmployee.last_name)}', ${currentEmployee.department_id})`);
    for (let salary of currentEmployee.salaries) {
      statementValues.push(`(${salary.id}, ${currentEmployee.id}, ${salary.amount}, '${salary.date}')`);
    }
    for (let donation of currentEmployee.donations) {
      donationValues.push(`(${donation.id}, ${currentEmployee.id}, ${donation.amount.split(' ')[0]}, '${donation.amount.split(' ')[1]}', '${donation.date}')`);
    }
  }

  // Insert all exchange rates in a single statement
  if (exchangeRateValues.length > 0) {
    sqlStatements.push(`INSERT INTO exchange_rates (date, currency, rate) VALUES ${exchangeRateValues.join(', ')} ON CONFLICT DO NOTHING;`);
  }

  // Insert all departments in a single statement
  if (departmentValues.length > 0) {
    sqlStatements.push(`INSERT INTO departments (id, name) VALUES ${departmentValues.join(', ')} ON CONFLICT DO NOTHING;`);
  }

  // Insert all employees in a single statement
  if (employeeValues.length > 0) {
    sqlStatements.push(`INSERT INTO employees (id, first_name, last_name, department_id) VALUES ${employeeValues.join(', ')} ON CONFLICT DO NOTHING;`);
  }

  // Insert all statements in a single statement
  if (statementValues.length > 0) {
    sqlStatements.push(`INSERT INTO statements (id, employee_id, amount, date) VALUES ${statementValues.join(', ')} ON CONFLICT DO NOTHING;`);
  }

  // Insert all donations in a single statement
  if (donationValues.length > 0) {
    sqlStatements.push(`INSERT INTO donations (id, employee_id, amount, currency, date) VALUES ${donationValues.join(', ')} ON CONFLICT DO NOTHING;`);
  }

  // Update donation in USD currency
  // Allowed by task requirements
  sqlStatements.push(`
    UPDATE donations d
    SET amount_in_usd = COALESCE(
      (d.amount * er.rate),
      d.amount
    )
    FROM exchange_rates er
    WHERE d.currency = er.currency 
      AND d.date = er.date
      OR d.currency = 'USD';
  `);


  fs.writeFile(outputFilePath, sqlStatements.join('\n'), (err) => {
    if (err) {
      console.error('Error writing output file:', err);
      return;
    }
    console.log('SQL dump file created successfully.');
  });
});
