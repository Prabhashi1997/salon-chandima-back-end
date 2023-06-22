"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Service_1 = require("../entity/Service");
class ServiceService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Service_1.Service)
            .createQueryBuilder('service');
        const [services, total] = await qb
            .orderBy('service.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            services: services.map((item) => {
                return {
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    duration: item.duration,
                };
            }),
            total,
        });
    }
    async getServices(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Service_1.Service)
            .createQueryBuilder('service');
        if (search) {
            qb.andWhere('lower(service.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [services, total] = await qb
            .orderBy('service.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            services: services.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addService(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newService = new Service_1.Service();
            newService.name = requestBody.name;
            newService.description = requestBody.description;
            newService.price = requestBody.price;
            if (!!requestBody.image) {
                newService.image = requestBody.image;
            }
            if (!!requestBody.category) {
                newService.category = requestBody.category;
            }
            if (!!requestBody.duration) {
                newService.duration = requestBody.duration;
            }
            await queryRunner.manager.save(newService);
            requestBody.id = newService.id;
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(requestBody);
        }
        catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteService(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Service_1.Service, { id: id });
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(id);
        }
        catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async editService(id, data) {
        const service = await database_1.DatabaseService.getInstance()
            .getRepository(Service_1.Service)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            service.name = data.name;
            service.description = data.description;
            service.price = data.price;
            service.image = data.image;
            service.category = data.category;
            service.duration = data.duration;
            await queryRunner.manager.save(service);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(service);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.ServiceService = ServiceService;
//# sourceMappingURL=serviceService.js.map