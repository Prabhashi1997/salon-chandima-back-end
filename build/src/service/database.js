"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
class DatabaseService {
    constructor() {
        this.connectionManager = (0, typeorm_1.getConnectionManager)();
        this.connection = this.connectionManager.create({
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
            synchronize: true,
        });
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance.connection;
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.js.map