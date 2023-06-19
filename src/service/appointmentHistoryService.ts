import {DatabaseService} from './database';
import {Responses} from '../Response';
import {AppointmentHistory} from "../entity/AppointmentHistory";
import { AppointmentHistoryData } from '../models/appointmentHistory';

export class AppointmentHistoryService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(AppointmentHistory)
            .createQueryBuilder('service');

        const [services, total] = await qb
            .orderBy('appointmentHistory.name')
            .getManyAndCount();

        return Responses.ok({
            services: services.map((item) => {
                return {
                    dateAndTime: item.dateAndTime,
                    status: item.status,
                    duration: item.duration,       
                };
            }),
            total,
        });
    }
    public async getAppointment(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(AppointmentHistory)
            .createQueryBuilder('service');
        if (search) {
            qb.andWhere('lower(appointmentHistory.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [appointmentHistory, total] = await qb
            .orderBy('appointmentHistory.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            appointmentHistory: appointmentHistory.map((item) => {
                return {...item};
            }),
            total,
        });
    }
    public async addAppointmentHistory(requestBody: AppointmentHistoryData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newAppointmentHistory = new AppointmentHistory();
            newAppointmentHistory.dateAndTime = requestBody.dateAndTime;
            newAppointmentHistory.status = requestBody.status;
            newAppointmentHistory.duration = requestBody.duration;
            await queryRunner.manager.save(newAppointmentHistory);

            requestBody.id = newAppointmentHistory.id;
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
    public async deleteAppointmentHistory(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(AppointmentHistory, { id: id });
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
    public async editAppointmentHistory(id: number, data: AppointmentHistoryData): Promise<{ body: any; statusCode: number }> {
        const appointmentHistory = await DatabaseService.getInstance()
            .getRepository(AppointmentHistory)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            appointmentHistory.dateAndTime = data.dateAndTime;
            appointmentHistory.status = data.status;
            appointmentHistory.duration = data.duration;

            await queryRunner.manager.save(appointmentHistory);
            await queryRunner.commitTransaction();
            return Responses.ok(appointmentHistory);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
