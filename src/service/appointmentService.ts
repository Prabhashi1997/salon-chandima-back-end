import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Appointment} from "../entity/Appointment";
import { AppointmentData } from '../models/appointment';

export class AppointmentService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Appointment)
            .createQueryBuilder('appointment');

        const [appointments, total] = await qb
            .orderBy('appointment.name')
            .getManyAndCount();

        return Responses.ok({
            appointments: appointments.map((item) => {
                return {
                    dateAndTime: item.dateAndTime,
                    status: item.status,
                    duration: item.duration,
                    deleted: item.deleted,        
                };
            }),
            total,
        });
    }
    public async getAppointment(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Appointment)
            .createQueryBuilder('appointment');
        if (search) {
            qb.andWhere('lower(appointment.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [appointments, total] = await qb
            .orderBy('appointment.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            appointments: appointments.map((item) => {
                return {...item};
            }),
            total,
        });
    }
    public async addAppointment(requestBody: AppointmentData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newAppointment = new Appointment();
            newAppointment.dateAndTime = requestBody.dateAndTime;
            newAppointment.status = requestBody.status;
            newAppointment.duration = requestBody.duration;
            newAppointment.deleted = requestBody.deleted;
            await queryRunner.manager.save(newAppointment);

            requestBody.id = newAppointment.id;
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
    public async editAppointment(id: number, data: AppointmentData): Promise<{ body: any; statusCode: number }> {
        const appointment = await DatabaseService.getInstance()
            .getRepository(Appointment)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            appointment.dateAndTime = data.dateAndTime;
            appointment.status = data.status;
            appointment.duration = data.duration;
            appointment.deleted = data.deleted;

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
}
