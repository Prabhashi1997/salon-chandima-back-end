import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {EmployeeService} from "../service/employeeService";
import { EmployeeData } from '../models/employee';

@Route('api/v1/employee')
export class EmployeeController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new EmployeeService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getEmployees(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new EmployeeService().getEmployee(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get('user')
    public async getEmployeebyUserId(@Request() request: any): Promise<void> {
        return this.exec(async () => {
            const response = await new EmployeeService().getEmployeebyUserId(+request?.user.userId);
            return Responses.ok(response);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get('{id}')
    public async getEmployee(@Path() id: number): Promise<void> {
        return this.exec(async () => {
            const response = await new EmployeeService().get(id);
            return Responses.ok(response);
        });
    }

    @Security('jwt', ['admin'])
    @Post()
    public async addEmployee(@Body() requestBody: any, @Request() request: any) {
        return this.exec(async () => {
            const response = await new EmployeeService().addEmployee(requestBody);
            return Responses.ok(response);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editEmployee(
        @Path() id: number,
        @Body() requestBody: any,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new EmployeeService().editEmployee(
                id, requestBody, +request?.user.userId,request?.user?.role ?? [],
            );
            return Responses.ok(designation?.body ?? designation);
        });
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteEmployee(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new EmployeeService().deleteEmployee(id);
            return Responses.ok(designation?.body ?? designation);
        });
    }
}