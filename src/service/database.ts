import dotenv from 'dotenv';
dotenv.config();
import { Connection, getConnectionManager } from 'typeorm';

export class DatabaseService {
  private static instance: DatabaseService;
  // connecting the database
  connectionManager = getConnectionManager();
  public connection = this.connectionManager.create({
    name: `default`,
    type: `mysql`,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../../src/entity/*.{js,ts}'],
    migrationsTableName: 'custom_migration_table',
    migrations: [__dirname + '/../../src/migration/*.{js,ts}'],
    subscribers: [],
    cli: {
      migrationsDir: 'migration',
    },
    // logging: true,
    synchronize: true,
  });
  // connection.connect();

  public static getInstance(): Connection {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance.connection;
  }
}
