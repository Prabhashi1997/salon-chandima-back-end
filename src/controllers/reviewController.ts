import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import {ReviewService} from "../service/reviewService";
import { ReviewData } from '../models/review';

@Route('api/v1/review')
export class ReviewController extends ControllerBase {

    @Get('all')
    public async getAll(): Promise<void> {
        return this.exec(async () => {
            const response = await new ReviewService().getAll();
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['customer'])
    @Get('user')
    public async getUser( @Request() request: any): Promise<void> {
        return this.exec(async () => {
            const response = await new ReviewService().getUser(+request.user.userId);
            return Responses.ok(response.body);
        });
    }




    @Get()
    public async getReview(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
        return this.exec(async () => {
            const response = await new ReviewService().getReview(page, size, search);
            return Responses.ok(response.body);
        });
    }

    @Security('jwt', ['customer'])
    @Post()
    public async addReview(@Body() requestBody: ReviewData, @Request() request: any) {
        return this.exec(async () => {
            const response = await new ReviewService().addReview(requestBody, +request.user.userId);
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

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async deleteReview(@Path() id: number, @Request() request: any): Promise<any> {
        return this.exec(async () => {
            const designation = await new ReviewService().deleteReview(id);
            return designation?.body ?? designation;
        });
    }
}
