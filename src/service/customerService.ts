import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Customer} from "../entity/Customer";
import { CustomerData } from '../models/customer';

export class CustomerService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer');

        const [customers, total] = await qb
            .orderBy('customer.name')
            .getManyAndCount();

        return Responses.ok({
            customers: customers.map((item) => {
                return {
                    gender: item.gender,      
                };
            }),
            total,
        });
    }
    public async getCustomer(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer');
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
                return {...item};
            }),
            total,
        });
    }
    public async addCustomer(requestBody: CustomerData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newCustomer = new Customer();
            newCustomer.gender = requestBody.gender;
            await queryRunner.manager.save(newCustomer);

            requestBody.id = newCustomer.id;
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
    public async deleteCustomer(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Customer, { id: id });
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
    public async editCustomer(id: number, data: CustomerData): Promise<{ body: any; statusCode: number }> {
        const customer = await DatabaseService.getInstance()
            .getRepository(Customer)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            customer.gender = data.gender;

            await queryRunner.manager.save(customer);
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
