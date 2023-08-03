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
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    duration: item.duration,
                    employeeName: item.employeeName,
                };
            }),
            total,
        });
    }
    async get(id) {
        const qb = await database_1.DatabaseService.getInstance()
            .getRepository(Service_1.Service)
            .createQueryBuilder('service')
            .where({ id })
            .getOne();
        return {
            data: {
                name: qb.name,
                description: qb.description,
                price: qb.price,
                image: qb.image,
                duration: qb.duration,
                employeeName: qb.employeeName,
            }
        };
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
            newService.duration = requestBody.duration;
            newService.price = requestBody.price;
            if (!!requestBody.image) {
                newService.image = requestBody.image;
            }
            if (!!requestBody.description) {
                newService.description = requestBody.description;
            }
            if (!!requestBody.employeeName) {
                newService.employeeName = requestBody.employeeName;
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
            const service = await queryRunner.manager
                .getRepository(Service_1.Service)
                .findOne({ where: { id: id } });
            if (service) {
                const service = await database_1.DatabaseService.getInstance().manager.delete;
                await queryRunner.manager.delete(Service_1.Service, { id: id });
            }
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
            service.duration = data.duration;
            service.employeeName = data.employeeName;
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