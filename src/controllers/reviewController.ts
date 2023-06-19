import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {ReviewService} from "../service/reviewService";
import { ReviewData } from '../models/review';

@Route('api/v1/appointment')
export class ReviewController extends ControllerBase {

    @Get()
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new ReviewService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['admin', 'employee'])
    @Get()
    public async getReview(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new ReviewService().getReview(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['cutomer'])
    @Post()
    public async addReview(@Body() requestBody: ReviewData, @Request() request: any) {
        return this.exec(async () => {
            const response = await new ReviewService().addReview(requestBody);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['customer'])
    @Patch('{id}')
    public async editReview(
        @Path() id: number,
        @Body() requestBody: ReviewData,
        @Request() request: any,
    ): Promise<any> {
        return this.exec(async () => {
            const designation = await new ReviewService().editReview(id, requestBody);
            return designation.body;
        });
    }

    @Security('jwt', ['customer'])
    @Delete('{id}')
    public async deleteReview(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new ReviewService().deleteReview(id);
            return designation?.body ?? designation;
        });
    }
}
