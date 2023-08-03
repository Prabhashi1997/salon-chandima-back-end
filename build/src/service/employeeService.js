"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Employee_1 = require("../entity/Employee");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../entity/User");
const Password_1 = require("../entity/Password");
const typeorm_1 = require("typeorm");
const Utils_1 = __importDefault(require("../common/Utils"));
const CustomerMessage_1 = require("../entity/CustomerMessage");
class EmployeeService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user');
        const [employees, total] = await qb
            .orderBy('user.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            employees: employees.map((item) => {
                return {
                    designation: item.designation,
                    name: item.user.firstName + ' ' + item.user.lastName,
                    email: item.user.email,
                };
            }),
            total,
        });
    }
    async get(id) {
        const qb = await database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user')
            .where({ id })
            .getOne();
        return {
            data: {
                firstName: qb.user.firstName,
                lastName: qb.user.lastName,
                contactNumber: qb.user.contactNumber,
                doj: qb.user.doj,
                email: qb.user.email,
                nic: qb.user.nic,
                gender: qb.gender,
                designation: qb.designation,
            }
        };
    }
    async getEmployeebyUserId(id) {
        const qb = await database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user')
            .where('employee.userId = :userID', { userID: id })
            .getOne();
        return {
            data: {
                id: qb.id,
                firstName: qb.user.firstName,
                lastName: qb.user.lastName,
                contactNumber: qb.user.contactNumber,
                doj: qb.user.doj,
                email: qb.user.email,
                nic: qb.user.nic,
                gender: qb.gender,
                designation: qb.designation,
            }
        };
    }
    async getEmployee(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user');
        if (search) {
            qb.andWhere('lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [employees, total] = await qb
            .orderBy('user.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            employees: employees.map((item) => {
                return Object.assign(Object.assign({}, item.user), item);
            }),
            total,
        });
    }
    async addEmployee(params) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync('User@123', salt);
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        const gender = params.gender;
        delete params.gender;
        const designation = params.designation;
        delete params.designation;
        try {
            const user = await queryRunner.manager
                .getRepository(User_1.User)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();
            if (!user) {
                const result = await queryRunner.manager.insert(User_1.User, Object.assign(Object.assign({}, params), { roles: ['employee'], email: params.email.toLowerCase(), name: `${params.firstName} ${params.lastName}`.toLowerCase() }));
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
                    if (!!user1.employeeId) {
                        throw new Response_1.ServiceError(Response_1.ResponseCode.conflict, 'Duplicate entry', { msg: `Already have admin for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic'}` });
                    }
                    const result = await queryRunner.manager.update(User_1.User, user1.id, {
                        roles: [...user1.roles, 'employee'],
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
            const newEmployee = new Employee_1.Employee();
            newEmployee.designation = designation;
            newEmployee.gender = gender;
            newEmployee.user = userx;
            await queryRunner.manager.save(newEmployee);
            userx.employee = newEmployee;
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
    async deleteEmployee(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const employee = await queryRunner.manager
                .getRepository(Employee_1.Employee)
                .findOne({ where: { id: id } });
            if (employee) {
                await queryRunner.manager.delete(Employee_1.Employee, { id: id });
                const user = await database_1.DatabaseService.getInstance()
                    .getRepository(User_1.User)
                    .findOne({ where: { id: employee.userId } });
                user.roles = user.roles.filter((n) => n !== 'employee');
                user.employeeId = null;
                await queryRunner.manager.update(User_1.User, employee.userId, user);
                await queryRunner.manager.delete(Employee_1.Employee, { id: id });
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
    async editEmployee(id, data, reqUserId, roles) {
        var _a, _b;
        const employee = await database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await database_1.DatabaseService.getInstance()
                .getRepository(User_1.User)
                .findOne({ where: { id: employee.userId } });
            if (roles.find((e) => e === 'admin') || reqUserId === user.id) {
                user.image = (_a = data === null || data === void 0 ? void 0 : data.image) !== null && _a !== void 0 ? _a : user.image;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.name = `${data.firstName} ${data.lastName}`.toLowerCase();
                await queryRunner.manager.save(user);
                employee.designation = data.designation;
                employee.gender = data.gender;
                await queryRunner.manager.save(employee);
                await queryRunner.commitTransaction();
                return Response_1.Responses.ok({
                    image: (_b = data === null || data === void 0 ? void 0 : data.image) !== null && _b !== void 0 ? _b : user.image,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    name: `${data.firstName} ${data.lastName}`.toLowerCase(),
                });
            }
            else {
                throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid authentication credentials');
            }
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
    async getMessages(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(CustomerMessage_1.CustomerMessage)
            .createQueryBuilder('customerMessage');
        if (search) {
            qb.andWhere('lower(customerMessage.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [messages, total] = await qb
            .orderBy('customerMessage.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            messages: messages.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
}
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employeeService.js.map