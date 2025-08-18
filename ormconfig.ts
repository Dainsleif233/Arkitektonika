import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();
dotenv.config({ path: '.env.local' });

const dbType = (process.env.DB_TYPE || 'sqlite') as 'postgres' | 'mysql' | 'sqlite';

let config: any = {
    type: dbType,
    database: process.env.DB_NAME || 'arkitektonika.db',
    synchronize: false, // 在生产环境中应该为false，使用迁移
    logging: process.env.NODE_ENV === 'development',
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
    migrationsTableName: 'arkitektonika_migrations',
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    }
};

// 如果不是SQLite，添加连接参数
if (dbType !== 'sqlite') {
    config = {
        ...config,
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        port: dbType === 'postgres' 
            ? parseInt(process.env.DB_PORT || '5432')
            : parseInt(process.env.DB_PORT || '3306')
    };
}

export default new DataSource(config);