import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Payment} from "../entity/Payment";
import { PaymentData } from '../models/payment';

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
                    type: item.type,
                    description: item.description,
                    price: item.price,
                    card_expiry: item.card_expiry,
                    card_holder_name: item.card_holder_name,
                    card_no: item.card_no, 
                    merchant_id: item.merchant_id,
                    method: item.method,
                    order_id: item.order_id,
                    payhere_amount: item.payhere_amount,
                    payhere_currency: item.payhere_currency,
                    payment_id: item.payment_id,
                    recurring: item.recurring,
                    status_code: item.status_code,
                    status_message: item.status_message,
                    transaction: item.transaction
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
    public async addPayment(requestBody: PaymentData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newPayment = new Payment();
            newPayment.type = requestBody.type;
            newPayment.description = requestBody.description;
            newPayment.price = requestBody.price;
            newPayment.card_expiry = requestBody.card_expiry;
            newPayment.card_holder_name = requestBody.card_holder_name;
            newPayment.card_no = requestBody.card_no;
            newPayment.merchant_id = requestBody.merchant_id;
            newPayment.method = requestBody.method;
            newPayment.order_id = requestBody.order_id;
            newPayment.payhere_amount = requestBody.payhere_amount;
            newPayment.payhere_currency = requestBody.payhere_currency;
            newPayment.payment_id = requestBody.payment_id;
            newPayment.recurring = requestBody.recurring;
            newPayment.status_code = requestBody.status_code;
            newPayment.status_message = requestBody.status_message;
            newPayment.transaction = requestBody.transaction;

            await queryRunner.manager.save(newPayment);

            requestBody.id = newPayment.id;
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
            payment.type = data.type;
            payment.description = data.description;
            payment.price = data.price;
            payment.card_expiry = data.card_expiry;
            payment.card_holder_name = data.card_holder_name;
            payment.card_no = data.card_no;
            payment.merchant_id = data.merchant_id;
            payment.method = data.method;
            payment.order_id = data.order_id;
            payment.payhere_amount = data.payhere_amount;
            payment.payhere_currency = data.payhere_currency;
            payment.payment_id = data.payment_id;
            payment.recurring = data.recurring;
            payment.status_code = data.status_code;
            payment.status_message = data.status_message;
            payment.transaction = data.transaction;

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
