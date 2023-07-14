import {DatabaseService} from './database';
import {ResponseCode, Responses, ServiceError} from '../Response';
import {Employee} from "../entity/Employee";
import { EmployeeData } from '../models/employee';
import bcrypt from "bcryptjs";
import {User, User as UserEntity} from "../entity/User";
import {Password as PasswordEntity} from "../entity/Password";
import {QueryFailedError} from "typeorm";
import Utils from "../common/Utils";

export class EmployeeService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Employee)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user');

        const [employees, total] = await qb
            .orderBy('employee.name')
            .getManyAndCount();

        return Responses.ok({
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

    public async get(id) {
        const qb = await DatabaseService.getInstance()
            .getRepository(Employee)
            .createQueryBuilder('employ')
            .leftJoinAndSelect('employ.user', 'user')
            .where({id})
            .getOne();

        return {
            data: {
                designation: qb.designation,
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
    public async getEmployee(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Employee)
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user');
        if (search) {
            qb.andWhere('lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [employees, total] = await qb
            .orderBy('user.name')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            employees: employees.map((item) => {
                return {
                    ...item.user,
                    ...item
                };
            }),
            total,
        });
    }
    public async addEmployee(params: EmployeeData): Promise<{ body: any; statusCode: number }> {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('User@123', salt);
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        const gender = params.gender;
        delete params.gender;
        const designation = params.designation;
        delete params.designation;

        try {
            const user = await queryRunner.manager
                .getRepository(UserEntity)
                .findOne({ where: { email: params.email } });
            if(!user) {
                // create user for employ
                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: ['user'],
                    email: params.email.toLowerCase(),
                    name: `${params.firstName} ${params.lastName}`.toLowerCase(),
                });
                await queryRunner.manager.insert(PasswordEntity, {
                    user: result.identifiers[0].id,
                    password: hash,
                });
            } else {

                const employee = await queryRunner.manager
                    .getRepository(Employee)
                    .findOne({ where: { userId: user.id } });

                if (!!employee) {
                    throw new ServiceError(ResponseCode.conflict, 'Duplicate entry');
                }

                const result = await queryRunner.manager.insert(UserEntity, {
                    ...params,
                    roles: [...user.roles,'user'],
                });
            }

            // create employ
            const newEmployee = new Employee();
            newEmployee.designation = designation;
            newEmployee.gender = gender;
            await queryRunner.manager.save(newEmployee);

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
    public async deleteEmployee(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {

            const employ = await queryRunner.manager
                .getRepository(Employee)
                .findOne({ where: { id: id } });

            if (employ) {
                await queryRunner.manager.delete(Employee, { id: id });
                const user = await DatabaseService.getInstance()
                    .getRepository(UserEntity)
                    .findOne({ where: { id: employ.userId } });
                user.roles = user.roles.filter((n) => n !== 'employ');
                await queryRunner.manager.update(User, employ.userId, user);
            }
            await queryRunner.manager.delete(Employee, { id: id });
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
    public async editEmployee(id: number, data: EmployeeData, reqUserId: number,roles: string[] ): Promise<{ body: any; statusCode: number }> {
        const employee = await DatabaseService.getInstance()
            .getRepository(Employee)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();


        const user = await DatabaseService.getInstance()
            .getRepository(UserEntity)
            .findOne({ where: { id: employee.userId } });

        try {
            if (roles.find((e) => e === 'admin' || e === 'employ') || reqUserId === user.id) {
                user.image = data?.image ?? user.image;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.name = `${data.firstName} ${data.lastName}`.toLowerCase();
                await queryRunner.manager.save(user);

                employee.designation = data.designation;
                employee.gender = data.gender;
                await queryRunner.manager.save(employee);
            } else {
                throw new ServiceError(ResponseCode.forbidden, 'Invalid authentication credentials');
            }

            await queryRunner.commitTransaction();
            return Responses.ok(employee);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
