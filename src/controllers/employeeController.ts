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
    public async getEmployee(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new EmployeeService().getEmployee(page, size, search);
            return Responses.ok(response.body);
        });
    }

    //@Security('jwt', ['admin'])
    @Post()
    public async addEmployee(@Body() requestBody: EmployeeData, @Request() request: any) {
        return this.exec(async () => {
            const response = await new EmployeeService().addEmployee(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editEmployee(
        @Path() id: number,
        @Body() requestBody: EmployeeData,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new EmployeeService().editEmployee(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteEmployee(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new EmployeeService().deleteEmployee(id);
            return designation?.body ?? designation;
        });
    }
}
