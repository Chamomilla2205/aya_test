import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
const host: string = process.env.DB_HOST || 'localhost';
const port: number = parseInt(process.env.DB_PORT, 10) || 5432;
const username: string = process.env.DB_USERNAME || 'postgres';
const password: string = process.env.DB_PASSWORD || 'postgres';
const database: string = process.env.DB_DATABASE || 'aya_software';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false,
});

// Initialize the connection
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });
