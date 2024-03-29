import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {ServiceService} from "../service/serviceService";
import {ServiceData} from "../models/Service";

@Route('api/v1/service')
export class ServiceController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new ServiceService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getSerivices(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new ServiceService().getServices(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get('{id}')
    public async getSerivice(@Path() id: number): Promise<void> {
        return this.exec(async () => {
            const response = await new ServiceService().get(id);
            return Responses.ok(response);
        });
    }

    @Security('jwt', ['admin'])
    @Post()
    public async addService(@Body() requestBody: any, @Request() request: any) {
        return this.exec(async () => {
            const response = await new ServiceService().addService(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editService(
        @Path() id: number,
        @Body() requestBody: any,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const service = await new ServiceService().editService(id, requestBody);
            return service.body;
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Delete('{id}')
    public async deleteService(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const service = await new ServiceService().deleteService(id);
            return service?.body ?? service;
        });
    }

}
