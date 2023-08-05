import {DatabaseService} from './database';
import {ResponseCode, Responses, ServiceError} from '../Response';
import {Customer} from "../entity/Customer";
import { CustomerData } from '../models/customer';
import bcrypt from "bcryptjs";
import {User, User as UserEntity} from "../entity/User";
import {Password as PasswordEntity} from "../entity/Password";
import {QueryFailedError} from "typeorm";
import Utils from "../common/Utils";
import { CustomerMessageType } from '../models/customer';
import { CustomerMessage } from '../entity/CustomerMessage';

export class CustomerService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user');

        const [customers, total] = await qb
            .orderBy('user.name')
            .getManyAndCount();

        return Responses.ok({
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

    public async getCustomerbyUserId(id) {
        const qb = await DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where('customer.userId = :userID',{ userID: id})
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

    public async getCustomer(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
        if (search) {
            qb.andWhere('lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [customers, total] = await qb
            .orderBy('user.name')
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
        delete params?.password;

        try {
            const user =  await queryRunner.manager
                .getRepository(UserEntity)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();
            if(!user) {
                // create user for admin
                // @ts-ignore
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

                const user1 =  await queryRunner.manager
                    .getRepository(UserEntity)
                    .createQueryBuilder('user')
                    .where('email =:email AND nic =:nic', { email: params.email, nic: params.nic })
                    .getOne();
                if (!!user1) {
                    if (!!user1.customerId) {
                        throw new ServiceError(
                            ResponseCode.conflict,
                            'Duplicate entry',
                            { msg: `Already have customer for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic' }`}
                        );
                    }
                    const result = await queryRunner.manager.update(UserEntity, user1.id, {
                        roles: [...user1.roles,'customer'],
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

            // create new Customer

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
            return { done: true };
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
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
    public async deleteCustomer(id: number): Promise<any> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const customer = await queryRunner.manager
                .getRepository(Customer)
                .findOne({ where: { id: id } });

            if (customer) {
                const user = await DatabaseService.getInstance()
                    .getRepository(UserEntity)
                    .findOne({ where: { id: customer.userId } });
                user.roles = user.roles.filter((n) => n !== 'customer');
                user.customerId = null;
                await queryRunner.manager.update(User, customer.userId, user);
                await queryRunner.manager.delete(Customer, { id: id });
            }
            await queryRunner.commitTransaction();
            return Responses.ok(id);
        } catch (e) {
            // since we have errors let's rollback changes we made
            console.log(e);
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

        try {
            const user = await DatabaseService.getInstance()
                .getRepository(UserEntity)
                .findOne({ where: { id: customer.userId } });
            if (roles.find((e) => e === 'admin' || e === 'employee') || reqUserId === user.id) {
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
            return Responses.ok({
                image: data?.image ?? user.image,
                firstName: data.firstName,
                lastName: data.lastName,
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

    public async addMessage(requestBody: CustomerMessageType): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newCustomerMessage = new CustomerMessage();
            newCustomerMessage.name = requestBody.name;
            newCustomerMessage.email = requestBody.email;
            newCustomerMessage.subject = requestBody.subject;
            newCustomerMessage.message = requestBody.message;
            
            await queryRunner.manager.save(newCustomerMessage);

            requestBody.id = newCustomerMessage.id;
            await queryRunner.commitTransaction();
            return Responses.ok(requestBody);
        } catch (e) {
            console.log(e);
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    public async getCustomerMessages(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(CustomerMessage)
            .createQueryBuilder('message')
        if (search) {
            qb.andWhere('lower(message.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [messages, total] = await qb
            .orderBy('message.name')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            data: messages.map((item) => {
                return {
                    ...item
                };
            }),
            total,
        });
    }

    public async register(params: CustomerData): Promise<{ done: boolean; }> {
        const salt = bcrypt.genSaltSync(10);
        const password = params.password;
        const hash = bcrypt.hashSync(password, salt);

        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        const gender = params.gender;
        const age = params.age;
        const address = params.address;
        delete params.gender;
        delete params.age;
        delete params.address;
        delete params.password;

        try {
            const user =  await queryRunner.manager
                .getRepository(UserEntity)
                .createQueryBuilder('user')
                .where('email =:email OR nic =:nic', { email: params.email, nic: params.nic })
                .getOne();
            if(!user) {
                // create user for admin
                // @ts-ignore
                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: ['customer'],
                    email: params.email.toLowerCase(),
                    name: `${params.firstName} ${params.lastName}`.toLowerCase()
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
                    if (!!user1.customerId) {
                        throw new ServiceError(
                            ResponseCode.conflict,
                            'Duplicate entry',
                            { msg: `Already have customer for ${user.email === params.email.toLowerCase() ? 'this email' : 'this nic' }`}
                        );
                    }
                    const result = await queryRunner.manager.update(UserEntity, user1.id, {
                        roles: [...user1.roles,'customer'],
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

            // create new Customer

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
            return { done: true };
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
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
}