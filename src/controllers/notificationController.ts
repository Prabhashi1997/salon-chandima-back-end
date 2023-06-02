import { Route, Post, Body, Query, Get, Patch, Path, Security, Request } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { NotificationData } from '../models/notification';
import { NotificationService } from '../service/notificationService';
import { Responses } from '../Response';

@Route('api/v1/notification')
export class NotificationController extends ControllerBase {
  // 1.2.0
  @Security('jwt', ['admin'])
  @Post()
  public async createNotification(@Body() requestBody: NotificationData, @Request() request: any) {
    return this.exec(async () => {
      const response = await new NotificationService().createNotification(requestBody);
      return Responses.ok(response.body);
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'user', 'hr', 'manger'])
  @Get()
  public async getNotification(
    @Request() request: any,
    @Query() userId: number,
    @Query() page?: number,
    @Query() size?: number,
    @Query() date?: string,
  ) {
    // return this.exec(async () => {
    const response = await new NotificationService().getNotification(+request.user.userId, page, size, date);
    return response.body;
    // });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'user', 'hr', 'manger'])
  @Patch('{userId}')
  public async markAsRead(
    @Path() userId: number,
    @Body() requestBody: { notificationId: number; all?: boolean },
    @Request() request: any,
  ) {
    return this.exec(async () => {
      const response = await new NotificationService().markAsRead(
        +request.user.userId,
        requestBody.notificationId,
        requestBody.all,
      );
      return Responses.ok(response.body);
    });
  }
}
