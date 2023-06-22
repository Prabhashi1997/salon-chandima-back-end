"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Configuration_1 = require("../entity/Configuration");
class ConfigurationService {
    async getConfig(page, size, search) {
        const qb = database_1.DatabaseService.getInstance().getRepository(Configuration_1.Configuration).createQueryBuilder('config');
        if (search) {
            qb.andWhere('lower(config.key) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [config, total] = await qb
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({ config, total });
    }
    async addConfig(requestBody) {
        const cycle = await database_1.DatabaseService.getInstance().manager.insert(Configuration_1.Configuration, {
            key: requestBody.key,
            value: requestBody.value,
        });
        requestBody.id = cycle.identifiers[0].id;
        return Response_1.Responses.ok(requestBody);
    }
    async deleteConfig(id) {
        await database_1.DatabaseService.getInstance().manager.delete(Configuration_1.Configuration, { id: id });
        return Response_1.Responses.ok(id);
    }
    async editConfig(id, data) {
        const config = await database_1.DatabaseService.getInstance()
            .getRepository(Configuration_1.Configuration)
            .findOne({ where: { id: id } });
        config.key = data.key;
        config.value = data.value;
        await database_1.DatabaseService.getInstance().manager.save(config);
        return Response_1.Responses.ok(config);
    }
}
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=configurationService.js.map