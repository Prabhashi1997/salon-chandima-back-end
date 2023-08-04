import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {PaymentService} from "../service/paymentService";
import { PaymentData } from '../models/payment';

@Route('api/v1/payment')
export class PaymentController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new PaymentService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getPayment(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new PaymentService().getPayment(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['customer'])
    @Post()
    public async addPayment(@Body() requestBody: any, @Request() request: any) {
        return this.exec(async () => {
            const response = await new PaymentService().addPayment(requestBody, +request.user.userId);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Patch('{id}')
    public async editPayment(
        @Path() id: number,
        @Body() requestBody: PaymentData,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new PaymentService().editPayment(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Delete('{id}')
    public async deletePayment(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new PaymentService().deletePayment(id);
            return designation?.body ?? designation;
        });
    }
}
