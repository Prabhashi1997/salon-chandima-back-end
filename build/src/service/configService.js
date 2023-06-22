"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const database_1 = require("./database");
const Configuration_1 = require("../entity/Configuration");
const typeorm_1 = require("typeorm");
class ConfigService {
    async getConfig(...configs) {
        const response = await database_1.DatabaseService.getInstance()
            .getRepository(Configuration_1.Configuration)
            .createQueryBuilder('configuration')
            .where({ key: (0, typeorm_1.In)(configs) })
            .getMany();
        const result = {};
        response.forEach((item) => {
            const itemKey = item.key;
            result[itemKey] = item.value;
        });
        return result;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=configService.js.map