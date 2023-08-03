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
import { CustomerMessage } from '../entity/CustomerMessage';

export class AdminService {
    public async getAll() {
        try {
            const qb = DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user');

        const [admin, total] = await qb
            .orderBy('user.name')
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

    public async get(id) {
        const qb = await DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user')
            .where({id})
            .getOne();

        return {
            data: {
                firstName: qb.user.firstName,
                lastName: qb.user.lastName,
                contactNumber: qb.user.contactNumber,
                doj: qb.user.doj,
                email: qb.user.email,
                nic: qb.user.nic,
            }
        };
    }

    public async getAdminbyUserId(id) {
        const qb = await DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user')
            .where('admin.userId = :userID',{ userID: id})
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
            }
        };
    }

    public async getAdmin(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .leftJoinAndSelect('admin.user', 'user');
        if (search) {
            qb.andWhere('lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [admin, total] = await qb
            .orderBy('user.name')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
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

    public async getMessages(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(CustomerMessage)
            .createQueryBuilder('customerMessage');
        if (search) {
            qb.andWhere('lower(customerMessage.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [messages, total] = await qb
            .orderBy('customerMessage.name')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            messages: messages.map((item) => {
                return {
                    ...item
                };
            }),
            total,
        });
    }

    public async addAdmin(params: UserCreationParams): Promise<any> {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('User@123', salt);
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const user =  await queryRunner.manager
                .getRepository(UserEntity)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();
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
                const user1 =  await queryRunner.manager
                    .getRepository(UserEntity)
                    .createQueryBuilder('user')
                    .where('email =:email AND nic =:nic', { email: params.email, nic: params.nic })
                    .getOne();
                if (!!user1) {
                    if (!!user1.adminId) {
                        throw new ServiceError(
                            ResponseCode.conflict,
                            'Duplicate entry',
                            { msg: `Already have admin for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic' }`}
                        );
                    }
                    const result = await queryRunner.manager.update(UserEntity, user1.id, {
                        roles: [...user1.roles,'admin'],
                    });
                } else {
                    throw new ServiceError(
                        ResponseCode.conflict,
                        'Duplicate entry',
                        { msg: `Already have user for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic' }`}
                    );
                }
            }

            const userx = await queryRunner.manager
                .getRepository(UserEntity)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();

            // create admin
            const newAdmin = new Admin();
            newAdmin.user = userx;
            await queryRunner.manager.save(newAdmin);


            userx.admin = newAdmin;
            await queryRunner.manager.save(userx);

            // commit transaction now:
            await queryRunner.commitTransaction();
            return { done: true };
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
            if (e instanceof QueryFailedError) {
                const err: any = e;
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new ServiceError(ResponseCode.conflict, 'Duplicate entry', {
                        msg: Utils.getIndexErrorMessage(UserEntity.Index, err.constraint),
                    });
                }
                console.log(e);
                throw new ServiceError(ResponseCode.forbidden, 'Unprocessable entity');
            } else {
                throw new ServiceError(e.code, e?.body?.msg);
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
                const user = await DatabaseService.getInstance()
                    .getRepository(UserEntity)
                    .findOne({ where: { id: admin.userId } });
                user.roles = user.roles.filter((n) => n !== 'admin');
                user.adminId = null;
                await queryRunner.manager.update(User, admin.userId, user);
                await queryRunner.manager.delete(Admin, { id: id });
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
            user.contactNumber = data.contactNumber;
            user.name = `${data.firstName} ${data.lastName}`.toLowerCase();

            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return Responses.ok({
                image: data?.image ?? user.image,
                firstName: data.firstName,
                lastName: data.lastName,
                contactNumber: data.contactNumber,
                name: `${data.firstName} ${data.lastName}`.toLowerCase(),
            });
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
                throw new ServiceError(ResponseCode.unprocessableEntity, 'Unprocessable entity');
            }
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}