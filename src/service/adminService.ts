import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Admin} from "../entity/Admin";
import {AdminData} from "../models/admin";

export class AdminService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin');

        const [admin, total] = await qb
            .orderBy('admin.name')
            .getManyAndCount();

        return Responses.ok({
            admin: Admin.map((item) => {
                return {
                    name: item.name,
                };
            }),
            total,
        });
    }
    public async getAdmin(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin');
        if (search) {
            qb.andWhere('lower(admin.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [admin, total] = await qb
            .orderBy('admin.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            admin: admin.map((item) => {
                return {...item};
            }),
            total,
        });
    }
    public async addAdmin(requestBody: AdminData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newAdmin = new Admin();
            await queryRunner.manager.save(newAdmin);

            requestBody.id = newAdmin.id;
            await queryRunner.commitTransaction();
            return Responses.ok(requestBody);
        } catch (e) {
            // console.log(e);
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
    public async deleteAdmin(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Admin, { id: id });
            await queryRunner.commitTransaction();
            return Responses.ok(id);
        } catch (e) {
            // since we have errors let's rollback changes we made
            // console.log(e);
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
    public async editAdmin(id: number, data: AdminData): Promise<{ body: any; statusCode: number }> {
        const admin = await DatabaseService.getInstance()
            .getRepository(Admin)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(admin);
            await queryRunner.commitTransaction();
            return Responses.ok(admin);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
