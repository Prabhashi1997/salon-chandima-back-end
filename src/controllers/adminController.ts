import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {AdminService} from "../service/adminService";
import {UserCreationParams} from "../models/user";

@Route('api/v1/admin')
export class AdminController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new AdminService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin'])
    @Get()
    public async getAdmins(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new AdminService().getAdmin(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin'])
    @Get('{id}')
    public async getAdmin(@Path() id: number): Promise<void> {
        return this.exec(async () => {
            const response = await new AdminService().get(id);
            return Responses.ok(response);
        });
    }

    @Security('jwt', ['admin'])
    @Post()
    public async addAdmin(@Body() requestBody: UserCreationParams, @Request() request: any) {
        return this.exec(async () => {
            const response = await new AdminService().addAdmin(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin'])
    @Patch('{id}')
    public async editAdmin(
        @Path() id: number,
        @Body() requestBody: UserCreationParams,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new AdminService().editAdmin(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteAdmin(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new AdminService().deleteAdmin(id);
            return designation?.body ?? designation;
        });
    }
}
