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

    @Security('jwt', ['admin'])
    @Post()
    public async addAppointmentHistory(@Body() requestBody: AppointmentHistoryData, @Request() request: any) {
        return this.exec(async () => {
            const response = await new AppointmentHistoryService().addAppointmentHistory(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editAppointmentHistory(
        @Path() id: number,
        @Body() requestBody: AppointmentHistoryData,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new AppointmentHistoryService().editAppointmentHistory(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteAppointmentHistory(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new AppointmentHistoryService().deleteAppointmentHistory(id);
            return designation?.body ?? designation;
        });
    }
}
