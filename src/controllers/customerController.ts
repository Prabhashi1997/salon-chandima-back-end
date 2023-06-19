import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {CustomerService} from "../service/commonService";
import {CustomerData} from '../models/'customer;

@Route('api/v1/customer')
export class CustomerController extends ControllerBase {

    @Get()
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new CustomerService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getCustomer(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new CustomerService().getCustomer(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin'])
    @Post()
    public async addCustomer(@Body() requestBody: CustomerData, @Request() request: any) {
        return this.exec(async () => {
            const response = await new CustomerService().addCustomer(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editCustomer(
        @Path() id: number,
        @Body() requestBody: CustomerData,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new CustomerService().editCustomer(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteCustomer(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new CustomerService().deleteCustomer(id);
            return designation?.body ?? designation;
        });
    }
}
