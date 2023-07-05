import {DatabaseService} from './database';
import {ResponseCode, Responses, ServiceError} from '../Response';
import {Customer} from "../entity/Customer";
import { CustomerData } from '../models/customer';
import bcrypt from "bcryptjs";
import {User, User as UserEntity} from "../entity/User";
import {Password as PasswordEntity} from "../entity/Password";
import {Admin} from "../entity/Admin";
import {QueryFailedError} from "typeorm";
import Utils from "../common/Utils";

export class CustomerService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user');

        const [customers, total] = await qb
            .orderBy('customer.name')
            .getManyAndCount();

        return Responses.ok({
            customers: customers.map((item) => {
                return {
                    name: item.user.firstName + ' ' + item.user.lastName,
                    email: item.user.email,
                };
            }),
            total,
        });
    }
    public async getCustomer(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
        if (search) {
            qb.andWhere('lower(customer.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [customers, total] = await qb
            .orderBy('customer.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            customers: customers.map((item) => {
                return {
                    ...item.user,
                    ...item
                };
            }),
            total,
        });
    }
    public async addCustomer(params: CustomerData): Promise<{ body: any; statusCode: number }> {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('User@123', salt);
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        const gender = params.gender;
        delete params.gender;

        try {
            const user = await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { email: params.email } });
            if(!user) {
                // create user for customer
                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: ['customer'],
                    email: params.email.toLowerCase(),
                    name: `${params.firstName} ${params.lastName}`.toLowerCase(),
                });
                await queryRunner.manager.insert(PasswordEntity, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
            } else {

                const customer = await queryRunner.manager
                    .getRepository(Customer)
                    .findOne({ where: { userId: user.id } });

                if (!!customer) {
                    throw new ServiceError(ResponseCode.conflict, 'Duplicate entry');
                }

                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: [...user.roles,'customer'],
                });
            }

            // create customer
            const newCustomer = new Customer();
            newCustomer.gender = gender;
            await queryRunner.manager.save(newCustomer);

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
    public async deleteCustomer(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const customer = await queryRunner.manager
                .getRepository(Customer)
                .findOne({ where: { id: id } });

            if (customer) {
                await queryRunner.manager.delete(Customer, { id: id });
                const user = await DatabaseService.getInstance()
                    .getRepository(UserEntity)
                    .findOne({ where: { id: customer.userId } });
                user.roles = user.roles.filter((n) => n !== 'customer');
                await queryRunner.manager.update(User, customer.userId, user);
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
    public async editCustomer(id: number, data: CustomerData, reqUserId: number, roles: string[]): Promise<{ body: any; statusCode: number }> {
        const customer = await DatabaseService.getInstance()
            .getRepository(Customer)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        const user = await DatabaseService.getInstance()
            .getRepository(UserEntity)
            .findOne({ where: { id: customer.userId } });

        try {
            if (roles.find((e) => e === 'admin' || e === 'employ') || reqUserId === user.id) {
                user.image = data?.image ?? user.image;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.name = `${data.firstName} ${data.lastName}`.toLowerCase();
                await queryRunner.manager.save(user);

                customer.gender = data.gender
                await queryRunner.manager.save(customer);
            } else {
                throw new ServiceError(ResponseCode.forbidden, 'Invalid authentication credentials');
            }

            await queryRunner.commitTransaction();
            return Responses.ok(customer);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
