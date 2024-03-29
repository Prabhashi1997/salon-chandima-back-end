import {Body, Delete, Example, Get, Patch, Path, Post, Query, Request, Response, Route, Security, SuccessResponse,} from 'tsoa';
import { ErrorJson } from '../models/response';
import { UserCreationParams } from '../models/user';
import { Responses } from '../Response';
import { UsersService } from '../service/usersService';
import { User } from '../entity/User';
import ControllerBase from '../common/ControllerBase';
import express from 'express';
import multer from 'multer';
import { DataTableResponse } from '../common/Definitions';

@Route('api/v1/users')
export class UsersController extends ControllerBase {
  // 1.2.0
  @Security('jwt', ['admin', 'customer', 'employee'])
  @Response<ErrorJson>(500, 'internal server error', {
    code: '500',
    message: 'internal server error',
    body: {},
  })
  @Response<ErrorJson>(401, 'unauthorized', {
    code: '401',
    message: 'JsonWebTokenError: invalid token || No token provided || JWT does not contain required scope.',
    body: {},
  })
  @Response<ErrorJson>(404, 'notFound', {
    code: '404',
    message: 'error',
    body: {},
  })
  @SuccessResponse('200', 'ok') // Custom success response
  @Example({
    id: 2,
    email: 'jane@doe.com',
    name: 'Jane Doe',
    phoneNumbers: [],
  })
  @Get('{userId}')
  public async getUser(@Request() request: any, @Path() userId: number): Promise<Responses> {
    return this.exec(async () => {
      if (
        request?.user.role.find((e) => e === 'hr' || e === 'admin' || e === 'manager') ||
        userId === +request?.user.userId
      ) {
        const user = await new UsersService().get(userId);
        return Responses.ok({ ...user });
      } else {
        return Responses.forbidden();
      }
    });
  }

  // 1.2.0
  @Post('request-password-reset')
  public async requestPasswordReset(@Body() body: { email: string }): Promise<UserCreationParams> {
    return this.exec(async () => {
      const user = await new UsersService().requestPasswordReset(body.email);
      return Responses.ok({ user });
    });
  }

  // 1.2.0
  @Post('password-reset')
  public async resetPasswordFromToken(@Body() body: { password: string; token: string }): Promise<UserCreationParams> {
    return this.exec(async () => {
      const user = await new UsersService().resetPasswordFromToken(body.token, body.password);
      return Responses.ok({ user });
    });
  }


  // 1.2.0
  @Security('jwt', ['admin', 'customer', 'employee'])
  @Get()
  public async getUsers(
    @Query() page?: number,
    @Query() size?: number,
    @Query() search?: string,
    @Query() email?: string,
    @Query() employeeId?: string,
    @Query() epfNumber?: string,
  ): Promise<DataTableResponse<User>> {
    return this.exec(async () => {
      const response = await new UsersService().getUsers(page, size, search, email, employeeId, epfNumber);
      return Responses.ok(response);
    });
  }


  private handleFile(request: express.Request): Promise<any> {
    const multerSingle = multer().single('avatar');
    return new Promise((resolve, reject) => {
      multerSingle(request, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve(undefined);
      });
    });
  }

  // 1.2.0
  @Response<ErrorJson>(500, 'internal server error', {
    code: '500',
    message: 'internal server error',
    body: {},
  })
  @SuccessResponse('201', 'Created') // Custom success response
  @Example({
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InVzZXIiLCJ1c2VySWQiOiIxMiIsInJvbGUiOlsiYWRtaW4iXSwiaWF0IjoxNjE5NjI3MjEzLCJleHAiOjE2MTk3MTM2MTMsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCIsImlzcyI6InBlcmZvcm1hbmMiLCJzdWIiOiJ1c2VyIn0.CgeNJmI5ka6z5AxbOIDeQamIKRzEk7-sTUY3lJq20DSWUUisBv9QThhgKzFzjPc2CbXmKCpQboOibLmz8qxFfYT6fNHix67oc_C3VCPaHb9UnvFgd8OKjQTBMV2l1n7HKQgNxkNFAPjYu2e3TqrsM2iNfxH41bUo5f39rpr7ltU',
  })
  @Post('login')
  public async login(@Body() requestBody: { email: string; password: string }): Promise<void> {
    const { email, password } = requestBody;
    return await this.exec(async () => {
      const token = await new UsersService().createSession(email, password);
      return Responses.ok({ token });
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'customer', 'employee'])
  @Get('refresh-token/{userId}')
  public async refreshToken(@Path() userId: number, @Request() request: any): Promise<void> {
    return await this.exec(async () => {
      const token = await new UsersService().refreshToken(+request.user.userId);
      return Responses.ok({ token });
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'customer', 'employee'])
  @Patch('password')
  public async changePassword(
    @Body() value: { password: string; },
    @Request() request: any,
  ): Promise<void> {
    return await this.exec(async () => {
      const response = await new UsersService().passwordChange(
          value,
        +request.user.userId,
      );
      return Responses.ok({ response });
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'employee'])
  @Patch('password-reset/{userId}')
  public async resetPassword(@Path() userId: number, @Body() value: { newPassword: string }): Promise<void> {
    return await this.exec(async () => {
      const response = await new UsersService().resetPassword(userId, value.newPassword);
      return Responses.ok({ response });
    });
  }
}