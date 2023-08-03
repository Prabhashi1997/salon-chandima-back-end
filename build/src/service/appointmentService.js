"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Appointment_1 = require("../entity/Appointment");
class AppointmentService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Appointment_1.Appointment)
            .createQueryBuilder('appointment');
        const [appointments, total] = await qb
            .orderBy('appointment.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            appointments: appointments.map((item) => {
                return {
                    date: item.date,
                    time: item.time,
                };
            }),
            total,
        });
    }
    async getAppointment(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Appointment_1.Appointment)
            .createQueryBuilder('appointment');
        if (search) {
            qb.andWhere('lower(appointment.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [appointments, total] = await qb
            .orderBy('appointment.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            appointments: appointments.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addAppointment(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newAppointment = new Appointment_1.Appointment();
            newAppointment.date = requestBody.date;
            newAppointment.time = requestBody.time;
            await queryRunner.manager.save(newAppointment);
            requestBody.id = newAppointment.id;
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
    async deleteAppointment(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Appointment_1.Appointment, { id: id });
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
    async editAppointment(id, data) {
        const appointment = await database_1.DatabaseService.getInstance()
            .getRepository(Appointment_1.Appointment)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            appointment.date = data.date;
            appointment.time = data.time;
            await queryRunner.manager.save(appointment);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(appointment);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointmentService.js.map