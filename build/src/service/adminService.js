"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Admin_1 = require("../entity/Admin");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../entity/User");
const Password_1 = require("../entity/Password");
const typeorm_1 = require("typeorm");
const Utils_1 = __importDefault(require("../common/Utils"));
class AdminService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Admin_1.Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user');
        const [admin, total] = await qb
            .orderBy('admin.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            admin: admin.map((item) => {
                return {
                    name: item.user.firstName + ' ' + item.user.lastName,
                    email: item.user.email
                };
            }),
            total,
        });
    }
    async getAdmin(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Admin_1.Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user');
        if (search) {
            qb.andWhere('lower(admin.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [admin, total] = await qb
            .orderBy('admin.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            admin: admin.map((item) => {
                return Object.assign(Object.assign({}, item.user), item);
            }),
            total,
        });
    }
    async addAdmin(params) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync('User@123', salt);
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager
                .getRepository(User_1.User)
                .findOne({ where: { email: params.email } });
            if (!user) {
                const result = await queryRunner.manager.insert(User_1.User, Object.assign(Object.assign({}, params), { roles: ['admin'], email: params.email.toLowerCase(), name: `${params.firstName} ${params.lastName}`.toLowerCase() }));
                await queryRunner.manager.insert(Password_1.Password, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
            }
            else {
                const admin = await queryRunner.manager
                    .getRepository(Admin_1.Admin)
                    .findOne({ where: { userId: user.id } });
                if (!!admin) {
                    throw new Response_1.ServiceError(Response_1.ResponseCode.conflict, 'Duplicate entry');
                }
                const result = await queryRunner.manager.insert(User_1.User, Object.assign(Object.assign({}, params), { roles: [...user.roles, 'admin'] }));
            }
            const newAdmin = new Admin_1.Admin();
            newAdmin.user = user;
            await queryRunner.manager.save(newAdmin);
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
    async deleteAdmin(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const admin = await queryRunner.manager
                .getRepository(Admin_1.Admin)
                .findOne({ where: { id: id } });
            if (admin) {
                await queryRunner.manager.delete(Admin_1.Admin, { id: id });
                const user = await database_1.DatabaseService.getInstance()
                    .getRepository(User_1.User)
                    .findOne({ where: { id: admin.userId } });
                user.roles = user.roles.filter((n) => n !== 'admin');
                await queryRunner.manager.update(User_1.User, admin.userId, user);
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
    async editAdmin(id, data) {
        var _a, _b;
        const admin = await database_1.DatabaseService.getInstance()
            .getRepository(Admin_1.Admin)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await database_1.DatabaseService.getInstance()
                .getRepository(User_1.User)
                .findOne({ where: { id: admin.userId } });
            user.image = (_a = data === null || data === void 0 ? void 0 : data.image) !== null && _a !== void 0 ? _a : user.image;
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.name = `${data.firstName} ${data.lastName}`.toLowerCase();
            await queryRunner.manager.save(user);
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
            console.log(e);
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
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map