import { DataSource } from 'typeorm';

// 数据库配置接口
interface DatabaseConfig {
    type: 'postgres' | 'mysql' | 'sqlite';
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database: string;
    synchronize?: boolean;
    logging?: boolean;
}

// 从环境变量获取数据库配置
function getDatabaseConfig(): DatabaseConfig {
    const dbType = (process.env.DB_TYPE || 'sqlite') as 'postgres' | 'mysql' | 'sqlite';
    
    const config: DatabaseConfig = {
        type: dbType,
        database: process.env.DB_NAME || 'arkitektonika.db',
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development'
    };

    // 如果不是SQLite，需要连接参数
    if (dbType !== 'sqlite') {
        config.host = process.env.DB_HOST || 'localhost';
        config.username = process.env.DB_USERNAME || 'root';
        config.password = process.env.DB_PASSWORD || '';
        
        if (dbType === 'postgres') {
            config.port = parseInt(process.env.DB_PORT || '5432');
        } else if (dbType === 'mysql') {
            config.port = parseInt(process.env.DB_PORT || '3306');
        }
    }

    return config;
}

// 创建数据源
export const AppDataSource = new DataSource({
    ...getDatabaseConfig(),
    entities: [__dirname + '/../entities/*.{ts,js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    subscribers: [__dirname + '/../subscribers/*.{ts,js}'],
    migrationsTableName: 'arkitektonika_migrations',
});

// 初始化数据库连接
export async function initializeDatabase() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Database connection initialized successfully');
        }
        return AppDataSource;
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
}

// 关闭数据库连接
export async function closeDatabase() {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
}