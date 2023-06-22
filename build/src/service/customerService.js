"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Customer_1 = require("../entity/Customer");
class CustomerService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer');
        const [customers, total] = await qb
            .orderBy('customer.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            customers: customers.map((item) => {
                return {
                    gender: item.gender,
                };
            }),
            total,
        });
    }
    async getCustomer(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer');
        if (search) {
            qb.andWhere('lower(customer.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [customers, total] = await qb
            .orderBy('customer.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            customers: customers.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addCustomer(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newCustomer = new Customer_1.Customer();
            newCustomer.gender = requestBody.gender;
            await queryRunner.manager.save(newCustomer);
            requestBody.id = newCustomer.id;
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(requestBody);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteCustomer(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Customer_1.Customer, { id: id });
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(id);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async editCustomer(id, data) {
        const customer = await database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            customer.gender = data.gender;
            await queryRunner.manager.save(customer);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(customer);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customerService.js.map