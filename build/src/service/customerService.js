"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Customer_1 = require("../entity/Customer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../entity/User");
const Password_1 = require("../entity/Password");
const typeorm_1 = require("typeorm");
const Utils_1 = __importDefault(require("../common/Utils"));
class CustomerService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user');
        const [customers, total] = await qb
            .orderBy('customer.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            customers: customers.map((item) => {
                return {
                    name: item.user.firstName + ' ' + item.user.lastName,
                    email: item.user.email,
                };
            }),
            total,
        });
    }
    async getCustomer(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user');
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
                return Object.assign(Object.assign({}, item.user), item);
            }),
            total,
        });
    }
    async addCustomer(params) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync('User@123', salt);
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        const gender = params.gender;
        delete params.gender;
        try {
            const user = await queryRunner.manager
                .getRepository(User_1.User)
                .findOne({ where: { email: params.email } });
            if (!user) {
                const result = await queryRunner.manager.insert(User_1.User, Object.assign(Object.assign({}, params), { roles: ['customer'], email: params.email.toLowerCase(), name: `${params.firstName} ${params.lastName}`.toLowerCase() }));
                await queryRunner.manager.insert(Password_1.Password, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
            }
            else {
                const customer = await queryRunner.manager
                    .getRepository(Customer_1.Customer)
                    .findOne({ where: { userId: user.id } });
                if (!!customer) {
                    throw new Response_1.ServiceError(Response_1.ResponseCode.conflict, 'Duplicate entry');
                }
                const result = await queryRunner.manager.insert(User_1.User, Object.assign(Object.assign({}, params), { roles: [...user.roles, 'customer'] }));
            }
            const newCustomer = new Customer_1.Customer();
            newCustomer.gender = gender;
            await queryRunner.manager.save(newCustomer);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok({});
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            if (e instanceof typeorm_1.QueryFailedError) {
                const err = e;
                if (err.code === '23505') {
                    throw new Response_1.ServiceError(Response_1.ResponseCode.conflict, 'Duplicate entry', {
                        errors: Utils_1.default.getIndexErrorMessage(User_1.User.Index, err.constraint),
                    });
                }
                throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Unprocessable entity');
            }
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteCustomer(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const customer = await queryRunner.manager
                .getRepository(Customer_1.Customer)
                .findOne({ where: { id: id } });
            if (customer) {
                await queryRunner.manager.delete(Customer_1.Customer, { id: id });
                const user = await database_1.DatabaseService.getInstance()
                    .getRepository(User_1.User)
                    .findOne({ where: { id: customer.userId } });
                user.roles = user.roles.filter((n) => n !== 'customer');
                await queryRunner.manager.update(User_1.User, customer.userId, user);
            }
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
    async editCustomer(id, data, reqUserId, roles) {
        var _a;
        const customer = await database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({ where: { id: customer.userId } });
        try {
            if (roles.find((e) => e === 'admin' || e === 'employ') || reqUserId === user.id) {
                user.image = (_a = data === null || data === void 0 ? void 0 : data.image) !== null && _a !== void 0 ? _a : user.image;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.name = `${data.firstName} ${data.lastName}`.toLowerCase();
                await queryRunner.manager.save(user);
                customer.gender = data.gender;
                await queryRunner.manager.save(customer);
            }
            else {
                throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid authentication credentials');
            }
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