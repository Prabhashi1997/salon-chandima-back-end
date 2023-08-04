import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Payment} from "../entity/Payment";
import { PaymentData } from '../models/payment';
import {Customer} from "../entity/Customer";
import {Appointment} from "../entity/Appointment";

export class PaymentService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Payment)
            .createQueryBuilder('payment');

        const [payments, total] = await qb
            .orderBy('payment.name')
            .getManyAndCount();

        return Responses.ok({
            payments: payments.map((item) => {
                return {
                    // type: item.type,
                    price: item.price,
                };
            }),
            total,
        });
    }
    public async getPayment(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Payment)
            .createQueryBuilder('payment');
        if (search) {
            qb.andWhere('lower(payment.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [payments, total] = await qb
            .orderBy('payment.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            payments: payments.map((item) => {
                return {...item};
            }),
            total,
        });
    }
    public async addPayment(requestBody: any, userId: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const qb1 = await DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where('user.id = :userID',{ userID: userId })
            .getOne();

            const qb2 = await DatabaseService.getInstance()
                .getRepository(Appointment)
                .createQueryBuilder('appointment')
                .where('appointment.id = :userID',{ userID: requestBody.orderId })
                .getOne();

            const newPayment = new Payment();
            newPayment.orderId = requestBody.orderId;
            newPayment.price = Math.ceil(qb2.price/100 * 30);
            newPayment.appointmentId = qb2.id;
            newPayment.customer = qb1;

            await queryRunner.manager.save(newPayment);


            qb2.status = 'Reserved';
            await queryRunner.manager.save(qb2);
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
    public async deletePayment(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Payment, { id: id });
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
    public async editPayment(id: number, data: PaymentData): Promise<{ body: any; statusCode: number }> {
        const payment = await DatabaseService.getInstance()
            .getRepository(Payment)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            // payment.orderId = data.id;
            // payment.price = data.price;
            // payment.appointmentId = data.id;
            // payment.customerId =

            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();
            return Responses.ok(payment);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
