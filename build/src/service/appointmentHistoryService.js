"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentHistoryService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const AppointmentHistory_1 = require("../entity/AppointmentHistory");
class AppointmentHistoryService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(AppointmentHistory_1.AppointmentHistory)
            .createQueryBuilder('service');
        const [appointmentHistory, total] = await qb
            .orderBy('appointmentHistory.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            appointmentHistory: appointmentHistory.map((item) => {
                return {
                    dateAndTime: item.dateAndTime,
                    status: item.status,
                    duration: item.duration,
                };
            }),
            total,
        });
    }
    async getAppointmentHistory(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(AppointmentHistory_1.AppointmentHistory)
            .createQueryBuilder('service');
        if (search) {
            qb.andWhere('lower(appointmentHistory.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [appointmentHistory, total] = await qb
            .orderBy('appointmentHistory.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            appointmentHistory: appointmentHistory.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addAppointmentHistory(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newAppointmentHistory = new AppointmentHistory_1.AppointmentHistory();
            newAppointmentHistory.dateAndTime = requestBody.dateAndTime;
            newAppointmentHistory.status = requestBody.status;
            newAppointmentHistory.duration = requestBody.duration;
            await queryRunner.manager.save(newAppointmentHistory);
            requestBody.id = newAppointmentHistory.id;
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
    async deleteAppointmentHistory(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(AppointmentHistory_1.AppointmentHistory, { id: id });
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
    async editAppointmentHistory(id, data) {
        const appointmentHistory = await database_1.DatabaseService.getInstance()
            .getRepository(AppointmentHistory_1.AppointmentHistory)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            appointmentHistory.dateAndTime = data.dateAndTime;
            appointmentHistory.status = data.status;
            appointmentHistory.duration = data.duration;
            await queryRunner.manager.save(appointmentHistory);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(appointmentHistory);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.AppointmentHistoryService = AppointmentHistoryService;
//# sourceMappingURL=appointmentHistoryService.js.map