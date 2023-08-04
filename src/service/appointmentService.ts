import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Appointment} from "../entity/Appointment";
import { AppointmentData } from '../models/appointment';
import {Customer} from "../entity/Customer";
import md5 from 'md5';
import {Service} from "../entity/Service";
import {In} from "typeorm";


export class AppointmentService {
    public async getCalenderAll(userId) {
        const qb = DatabaseService.getInstance()
            .getRepository(Appointment)
            .createQueryBuilder('appointment')
            .andWhere('appointment.status != :astatus', {
                astatus: 'Pending',
            });

        const qb1 = await DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where('user.id = :userID',{ userID: userId })
            .getOne();

        const [appointments, total] = await qb
            .orderBy('appointment.start')
            .getManyAndCount();

        return Responses.ok({
            appointments: appointments.map((item) => {
                return {
                    title: item.customerId === qb1.id ? qb1.user.firstName + ' ' + qb1.user.lastName : 'Booked',
                    color: item.customerId === qb1.id ? '#ad1457' : 'black',
                    id: item.id,
                    date: item.date,
                    status: item.status,
                    duration: item.duration,
                    deleted: item.deleted,
                    start: item.start,
                    end: item.end,
                };
            }),
            total,
        });
    }
    public async getCalenderAppointment(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Appointment)
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.customer','customer')
            .leftJoinAndSelect('customer.user','user')
            .andWhere('appointment.status != :astatus', {
                astatus: 'Pending',
            });
        if (search) {
            qb.andWhere('lower(appointment.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [appointments, total] = await qb
            .orderBy('appointment.start')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        const customers = [...new Set(appointments.map((e) => e.customerId))].map((e,i) => ({
            id: e,
            color: this.randColor(i)
        }));


        return Responses.ok({
            appointments: appointments.map((item) => {
                return {
                    title: item.customer.user.firstName + ' ' + item.customer.user.lastName,
                    color: customers.find((x) => x.id === item.customerId).color,
                    id: item.id,
                    date: item.date,
                    status: item.status,
                    duration: item.duration,
                    deleted: item.deleted,
                    start: item.start,
                    end: item.end,
                };
            }),
            total,
        });
    }

    randColor(i)  {
        const x = (i % 10);
        const y = ["#6666ff","#0cc660","#66cc00","#993300","#ff3300","#999900","#ff0ff0","#ff6600","#666633","#66ff00"]
        return y[x];
    }

    public async getAll(userId) {
        const qb1 = await DatabaseService.getInstance()
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where('user.id = :userID',{ userID: userId })
            .getOne();

        const qb = DatabaseService.getInstance()
            .getRepository(Appointment)
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.payments','payments')
            .leftJoinAndSelect('appointment.services','services')
            .andWhere('appointment.status != :astatus AND appointment.customerId = :cId', {
                astatus: 'Pending',
                cId: qb1.id,
            });

        const [appointments, total] = await qb
            .orderBy('appointment.start')
            .getManyAndCount();

        return Responses.ok({
            appointments: appointments.map((item) => {
                return {
                    title: qb1.user.firstName + ' ' + qb1.user.lastName,
                    color:'#ad1457',
                    id: item.id,
                    date: item.date,
                    status: item.status,
                    duration: item.duration,
                    deleted: item.deleted,
                    start: item.start,
                    end: item.end,
                    price: item.price,
                    // totalPrice: item.price / 100 * (100 - item.discount) - item?.payments?.[0]?.price ?? 0,
                    services: item.services.map((e) => e.name).join(', '),
                    advance: item?.payments?.[0]?.price ?? 0,
                };
            }),
            total,
        });
    }
    public async getAppointment(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Appointment)
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.customer','customer')
            .leftJoinAndSelect('customer.user','user')
            .leftJoinAndSelect('appointment.payments','payments')
            .leftJoinAndSelect('appointment.services','services')
            .andWhere('appointment.status != :astatus', {
                astatus: 'Pending',
            });
        if (search) {
            qb.andWhere('lower(appointment.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [appointments, total] = await qb
            .orderBy('appointment.start')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        const customers = [...new Set(appointments.map((e) => e.customerId))].map((e,i) => ({
            id: e,
            color: this.randColor(i)
        }));


        return Responses.ok({
            appointments: appointments.map((item) => {
                return {
                    title: item.customer.user.firstName + ' ' + item.customer.user.lastName,
                    color: customers.find((x) => x.id === item.customerId).color,
                    id: item.id,
                    date: item.date,
                    status: item.status,
                    duration: item.duration,
                    deleted: item.deleted,
                    start: item.start,
                    end: item.end,
                    services: item.services.map((e) => e.name).join(', '),
                    price: item.price,
                    // totalPrice: item.price / 100 * (100 - item.discount) - item?.payments?.[0]?.price ?? 0,
                    advance: item?.payments?.[0]?.price ?? 0,
                };
            }),
            total,
        });
    }
    public async addAppointment(requestBody: AppointmentData, userId: number): Promise<any> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const qb1 = await DatabaseService.getInstance()
                .getRepository(Customer)
                .createQueryBuilder('customer')
                .leftJoinAndSelect('customer.user', 'user')
                .where('user.id = :userID',{ userID: userId })
                .getOne();

            const services = await DatabaseService.getInstance()
                .getRepository(Service)
                .find({ where: { id: In(requestBody.service) } });

            const newAppointment = new Appointment();
            newAppointment.date = requestBody.date;
            newAppointment.start = requestBody.start;
            newAppointment.services = services;
            newAppointment.end = requestBody.end;
            newAppointment.customer = qb1;
            newAppointment.status = 'Pending';
            newAppointment.duration = requestBody.duration;
            newAppointment.price = requestBody.price;
            await queryRunner.manager.save(newAppointment);

            requestBody.id = newAppointment.id;
            await queryRunner.commitTransaction();
            const merchant_id = '1223636';
            const merchant_secret = 'Mzc2NjQzNTk3NDYxMjU1ODgzODM5OTA5NjQ0MDIxMDU5NDIyMzQ2';
            const hash = (md5(merchant_id + requestBody.id + Math.ceil(requestBody.price/100*30) + '.00' + 'LKR' + (md5(merchant_secret)).toUpperCase())).toUpperCase()

            return { ...requestBody, hash, payPrice: requestBody.price/100*30 };
        } catch (e) {
            console.log(e);
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    public async addAdminAppointment(requestBody: AppointmentData, userId: number): Promise<any> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {


            const services = await DatabaseService.getInstance()
                .getRepository(Service)
                .find({ where: { id: In(requestBody.service) } });

            const newAppointment = new Appointment();
            newAppointment.date = requestBody.date;
            newAppointment.start = requestBody.start;
            newAppointment.services = services;
            newAppointment.end = requestBody.end;
            newAppointment.customerId = userId;
            newAppointment.status = 'Reserved';
            newAppointment.duration = requestBody.duration;
            newAppointment.price = requestBody.price;
            await queryRunner.manager.save(newAppointment);

            requestBody.id = newAppointment.id;
            await queryRunner.commitTransaction();
            return { ...requestBody, payPrice: requestBody.price/100*30 };
        } catch (e) {
            console.log(e);
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    public async deleteAppointment(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Appointment, { id: id });
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
    public async editAppointment(id: number, data: any): Promise<{ body: any; statusCode: number }> {
        const appointment = await DatabaseService.getInstance()
            .getRepository(Appointment)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            appointment.date = data.date;
            appointment.start = data.start;
            appointment.end = data.end;

            await queryRunner.manager.save(appointment);
            await queryRunner.commitTransaction();
            return Responses.ok(appointment);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    // async addDiscount(data: any){
    //     const appointment = await DatabaseService.getInstance()
    //         .getRepository(Appointment)
    //         .findOne({ where: { id: data.id } });
    //     const queryRunner = DatabaseService.getInstance().createQueryRunner();
    //     await queryRunner.startTransaction();

    //     try {
    //         appointment.discount = data.discount;

    //         await queryRunner.manager.save(appointment);
    //         await queryRunner.commitTransaction();
    //         return Responses.ok(appointment);
    //     } catch (e) {
    //         // since we have errors let's rollback changes we made
    //         await queryRunner.rollbackTransaction();
    //     } finally {
    //         // you need to release query runner which is manually created:
    //         await queryRunner.release();
    //     }
    // }

}
