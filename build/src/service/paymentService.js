"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Payment_1 = require("../entity/Payment");
class PaymentService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Payment_1.Payment)
            .createQueryBuilder('payment');
        const [payments, total] = await qb
            .orderBy('payment.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
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
    async getPayment(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Payment_1.Payment)
            .createQueryBuilder('payment');
        if (search) {
            qb.andWhere('lower(payment.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [payments, total] = await qb
            .orderBy('payment.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            payments: payments.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addPayment(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newPayment = new Payment_1.Payment();
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
            return Response_1.Responses.ok(requestBody);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async deletePayment(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Payment_1.Payment, { id: id });
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(id);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async editPayment(id, data) {
        const payment = await database_1.DatabaseService.getInstance()
            .getRepository(Payment_1.Payment)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
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
            return Response_1.Responses.ok(payment);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=paymentService.js.map