import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {AppointmentHistoryService} from "../service/appointmentHistoryService";
import { AppointmentHistoryData } from '../models/appointmentHistory';

@Route('api/v1/appointment-history')
export class AppointmentHistoryController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new AppointmentHistoryService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getAppointmentHistory(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new AppointmentHistoryService().getAppointmentHistory(page, size, search);
            return Responses.ok(response.body);
        });
    }

}
