import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {AppointmentService} from "../service/appointmentService";
import {AppointmentData} from "../models/appointment";

@Route('api/v1/appointment')
export class AppointmentController extends ControllerBase {

    @Get()
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new AppointmentService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getAppointment(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new AppointmentService().getAppointment(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin'])
    @Post()
    public async addAppointment(@Body() requestBody: AppointmentData, @Request() request: any) {
        return this.exec(async () => {
            const response = await new AppointmentService().addAppointment(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editAppointment(
        @Path() id: number,
        @Body() requestBody: AppointmentData,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new AppointmentService().editAppointment(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteAppointment(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new AppointmentService().deleteAppointment(id);
            return designation?.body ?? designation;
        });
    }
}
