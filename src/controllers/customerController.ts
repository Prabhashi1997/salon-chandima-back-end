import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import { CustomerService } from '../service/customerService';
import {CustomerData} from '../models/customer';

@Route('api/v1/customer')
export class CustomerController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new CustomerService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getCustomers(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new CustomerService().getCustomer(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get('{id}')
    public async getCustomer(@Path() id: number): Promise<void> {
        return this.exec(async () => {
            const response = await new CustomerService().get(id);
            return Responses.ok(response);
        });
    }


    @Security('jwt', ['admin', 'employee'])
    @Post()
    public async addCustomer(@Body() requestBody: any, @Request() request: any) {
        return this.exec(async () => {
            const response = await new CustomerService().addCustomer(requestBody);
            return Responses.ok(response);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editCustomer(
        @Path() id: number,
        @Body() requestBody: any,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const response = await new CustomerService().editCustomer(
                id, requestBody, +request?.user.userId,request?.user?.role ?? [],

            );
            return response.body;
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Delete('{id}')
    public async deleteCustomer(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const response = await new CustomerService().deleteCustomer(id);
            return response?.body ?? response;
        });
    }
}
