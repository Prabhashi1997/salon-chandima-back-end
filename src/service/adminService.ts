import {DatabaseService} from './database';
import {ResponseCode, Responses, ServiceError} from '../Response';
import {Admin} from "../entity/Admin";
import {AdminData} from "../models/admin";
import bcrypt from "bcryptjs";
import {User, User as UserEntity} from "../entity/User";
import {Password as PasswordEntity} from "../entity/Password";
import {QueryFailedError} from "typeorm";
import Utils from "../common/Utils";
import {UserCreationParams} from "../models/user";
import {Customer} from "../entity/Customer";

export class AdminService {
    public async getAll() {
        try {
            const qb = DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user');

        const [admin, total] = await qb
            .orderBy('admin.name')
            .getManyAndCount();
        console.log(admin, total)

        return Responses.ok({
            admin: admin.map((item) => {
                return {
                    name: item.user.firstName + ' ' + item.user.lastName,
                    email: item.user.email
                };
            }),
            total,
        }); 
        } catch (error) {
            console.log(error)
        }
    
    }
    public async getAdmin(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user');
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
                return {
                    ...item.user,
                    ...item
                };
            }),
            total,
        });
    }
    public async addAdmin(params: UserCreationParams): Promise<{ body: any; statusCode: number }> {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('User@123', salt);
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { email: params.email } });
            if(!user) {
                // create user for admin
                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: ['admin'],
                    email: params.email.toLowerCase(),
                    name: `${params.firstName} ${params.lastName}`.toLowerCase(),
                });
                await queryRunner.manager.insert(PasswordEntity, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
            } else {
                const admin = await queryRunner.manager
                    .getRepository(Admin)
                    .findOne({ where: { userId: user.id } });

                if (!!admin) {
                    throw new ServiceError(ResponseCode.conflict, 'Duplicate entry');
                }
                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: [...user.roles,'admin'],
                });
            }

            // create admin
            const newAdmin = new Admin();
            newAdmin.user = user;
            await queryRunner.manager.save(newAdmin);

            // commit transaction now:
            await queryRunner.commitTransaction();
            return Responses.ok({});
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
            if (e instanceof QueryFailedError) {
                const err: any = e;
                if (err.code === '23505') {
                    throw new ServiceError(ResponseCode.conflict, 'Duplicate entry', {
                        errors: Utils.getIndexErrorMessage(UserEntity.Index, err.constraint),
                    });
                }
                throw new ServiceError(ResponseCode.forbidden, 'Unprocessable entity');
            }
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
    public async deleteAdmin(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const admin = await queryRunner.manager
                .getRepository(Admin)
                .findOne({ where: { id: id } });

            if (admin) {
                await queryRunner.manager.delete(Admin, { id: id });
                const user = await DatabaseService.getInstance()
                    .getRepository(UserEntity)
                    .findOne({ where: { id: admin.userId } });
                user.roles = user.roles.filter((n) => n !== 'admin');
                await queryRunner.manager.update(User, admin.userId, user);
            }

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
    public async editAdmin(id: number, data: UserCreationParams): Promise<{ body: any; statusCode: number }> {
        const admin = await DatabaseService.getInstance()
            .getRepository(Admin)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const user = await DatabaseService.getInstance()
                .getRepository(UserEntity)
                .findOne({ where: { id: admin.userId } });

            user.image = data?.image ?? user.image;
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.name = `${data.firstName} ${data.lastName}`.toLowerCase();

            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return Responses.ok({
                image: data?.image ?? user.image,
                firstName: data.firstName,
                lastName: data.lastName,
                name: `${data.firstName} ${data.lastName}`.toLowerCase(),
            });
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
            console.log(e);
            if (e instanceof QueryFailedError) {
                const err: any = e;
                if (err.code === '23505') {
                    throw new ServiceError(ResponseCode.conflict, 'Duplicate entry', {
                        errors: Utils.getIndexErrorMessage(UserEntity.Index, err.constraint),
                    });
                }
                throw new ServiceError(ResponseCode.unprocessableEntity, 'Unprocessable entity');
            }
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
