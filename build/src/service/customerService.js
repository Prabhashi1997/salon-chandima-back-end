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
const CustomerMessage_1 = require("../entity/CustomerMessage");
class CustomerService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user');
        const [customers, total] = await qb
            .orderBy('user.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            customers: customers.map((item) => {
                return {
                    name: item.user.firstName + ' ' + item.user.lastName,
                    email: item.user.email,
                    id: item.id,
                };
            }),
            total,
        });
    }
    async get(id) {
        const qb = await database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where({ id })
            .getOne();
        return {
            data: {
                address: qb.address,
                age: qb.age,
                gender: qb.gender,
                contactNumber: qb.user.contactNumber,
                doj: qb.user.doj,
                email: qb.user.email,
                firstName: qb.user.firstName,
                lastName: qb.user.lastName,
                nic: qb.user.nic,
            }
        };
    }
    async getCustomerbyUserId(id) {
        const qb = await database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where('customer.userId = :userID', { userID: id })
            .getOne();
        return {
            data: {
                id: qb.id,
                address: qb.address,
                age: qb.age,
                gender: qb.gender,
                contactNumber: qb.user.contactNumber,
                doj: qb.user.doj,
                email: qb.user.email,
                firstName: qb.user.firstName,
                lastName: qb.user.lastName,
                nic: qb.user.nic,
            }
        };
    }
    async getCustomer(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user');
        if (search) {
            qb.andWhere('lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [customers, total] = await qb
            .orderBy('user.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            data: customers.map((item) => {
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
        const age = params.age;
        const address = params.address;
        delete params.gender;
        delete params.age;
        delete params.address;
        try {
            const user = await queryRunner.manager
                .getRepository(User_1.User)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();
            if (!user) {
                const result = await queryRunner.manager.insert(User_1.User, Object.assign(Object.assign({}, params), { roles: ['customer'], email: params.email.toLowerCase(), name: `${params.firstName} ${params.lastName}`.toLowerCase() }));
                await queryRunner.manager.insert(Password_1.Password, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
            }
            else {
                const user1 = await queryRunner.manager
                    .getRepository(User_1.User)
                    .createQueryBuilder('user')
                    .where('email =:email AND nic =:nic', { email: params.email, nic: params.nic })
                    .getOne();
                if (!!user1) {
                    if (!!user1.customerId) {
                        throw new Response_1.ServiceError(Response_1.ResponseCode.conflict, 'Duplicate entry', { msg: `Already have customer for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic'}` });
                    }
                    const result = await queryRunner.manager.update(User_1.User, user1.id, {
                        roles: [...user1.roles, 'customer'],
                    });
                }
                else {
                    throw new Response_1.ServiceError(Response_1.ResponseCode.conflict, 'Duplicate entry', { msg: `Already have user for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic'}` });
                }
            }
            const userx = await queryRunner.manager
                .getRepository(User_1.User)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();
            const newCustomer = new Customer_1.Customer();
            newCustomer.gender = gender;
            newCustomer.age = age;
            newCustomer.address = address;
            newCustomer.user = userx;
            const x = await queryRunner.manager.save(newCustomer);
            userx.customer = newCustomer;
            await queryRunner.manager.save(userx);
            await queryRunner.commitTransaction();
            return { done: true };
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
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
                const user = await database_1.DatabaseService.getInstance()
                    .getRepository(User_1.User)
                    .findOne({ where: { id: customer.userId } });
                user.roles = user.roles.filter((n) => n !== 'customer');
                user.customerId = null;
                await queryRunner.manager.update(User_1.User, customer.userId, user);
                await queryRunner.manager.delete(Customer_1.Customer, { id: id });
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
    async editCustomer(id, data, reqUserId, roles) {
        var _a, _b;
        const customer = await database_1.DatabaseService.getInstance()
            .getRepository(Customer_1.Customer)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await database_1.DatabaseService.getInstance()
                .getRepository(User_1.User)
                .findOne({ where: { id: customer.userId } });
            if (roles.find((e) => e === 'admin' || e === 'employee') || reqUserId === user.id) {
                user.image = (_a = data === null || data === void 0 ? void 0 : data.image) !== null && _a !== void 0 ? _a : user.image;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.lastName = data.lastName;
                user.contactNumber = data.contactNumber;
                user.name = `${data.firstName} ${data.lastName}`.toLowerCase();
                await queryRunner.manager.save(user);
                customer.gender = data.gender;
                customer.age = data.age;
                customer.address = data.address;
                await queryRunner.manager.save(customer);
            }
            else {
                throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid authentication credentials');
            }
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok({
                image: (_b = data === null || data === void 0 ? void 0 : data.image) !== null && _b !== void 0 ? _b : user.image,
                firstName: data.firstName,
                lastName: data.lastName,
                name: `${data.firstName} ${data.lastName}`.toLowerCase(),
            });
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
                throw new Response_1.ServiceError(Response_1.ResponseCode.unprocessableEntity, 'Unprocessable entity');
            }
        }
        finally {
            await queryRunner.release();
        }
    }
    async addMessage(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newCustomerMessage = new CustomerMessage_1.CustomerMessage();
            newCustomerMessage.name = requestBody.name;
            newCustomerMessage.email = requestBody.email;
            newCustomerMessage.subject = requestBody.subject;
            newCustomerMessage.message = requestBody.message;
            await queryRunner.manager.save(newCustomerMessage);
            requestBody.id = newCustomerMessage.id;
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
    async getCustomerMessages(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(CustomerMessage_1.CustomerMessage)
            .createQueryBuilder('message');
        if (search) {
            qb.andWhere('lower(message.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [messages, total] = await qb
            .orderBy('message.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            data: messages.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customerService.js.map