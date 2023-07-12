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
    public async get(id) {
        const qb = await DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where({id})
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

    public async getCustomer(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
        if (search) {
            qb.andWhere('lower(user.email) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [customers, total] = await qb
            .orderBy('user.email')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            data: customers.map((item) => {
                return {
                    ...item.user,
                    ...item
                };
            }),
            total,
        });
    }
    public async addCustomer(params: CustomerData): Promise<{ done: boolean; }> {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('User@123', salt);
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        const gender = params.gender;
        const age = params.age;
        const address = params.address;
        delete params.gender;
        delete params.age;
        delete params.address;

        try {
            const user = await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { email: params.email } }) ?? await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { nic: params.email } });
            let userId;
            if(!user) {
                // create user for customer
                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: ['customer'],
                    email: params.email.toLowerCase(),
                    doj: new Date(),
                    name: `${params.firstName} ${params.lastName}`.toLowerCase(),
                });
                await queryRunner.manager.insert(PasswordEntity, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
                userId = result.identifiers[0].id;
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

            console.log('user', userId)
            const userx = await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { email: params.email } }) ?? await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { nic: params.email } });
            // create customer
            const newCustomer = new Customer();
            newCustomer.gender = gender;
            newCustomer.age = age;
            newCustomer.address = address;
            newCustomer.user = userx;
            const x = await queryRunner.manager.save(newCustomer);


            userx.customer = newCustomer;
            await queryRunner.manager.save(userx);

            // commit transaction now:
            await queryRunner.commitTransaction();
            return { done: true};
        } catch (e) {
            console.log(e);
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
            throw new ServiceError(ResponseCode.forbidden,  e.message);
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
                user.lastName = data.lastName;
                user.contactNumber = data.contactNumber;
                user.name = `${data.firstName} ${data.lastName}`.toLowerCase();


                await queryRunner.manager.save(user);

                customer.gender = data.gender;
                customer.age = data.age;
                customer.address = data.address;
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
