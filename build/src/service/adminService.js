"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Admin_1 = require("../entity/Admin");
class AdminService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Admin_1.Admin)
            .createQueryBuilder('admin');
        const [admin, total] = await qb
            .orderBy('admin.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            admin: Admin_1.Admin.map((item) => {
                return {
                    name: item.name,
                };
            }),
            total,
        });
    }
    async getAdmin(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Admin_1.Admin)
            .createQueryBuilder('admin');
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
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addAdmin(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newAdmin = new Admin_1.Admin();
            await queryRunner.manager.save(newAdmin);
            requestBody.id = newAdmin.id;
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
    async deleteAdmin(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Admin_1.Admin, { id: id });
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
        const admin = await database_1.DatabaseService.getInstance()
            .getRepository(Admin_1.Admin)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(admin);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(admin);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map