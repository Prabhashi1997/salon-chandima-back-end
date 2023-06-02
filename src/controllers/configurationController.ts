import ControllerBase from '../common/ControllerBase';
import { Route, Body, Delete, Get, Patch, Path, Post, Query, Security, Request } from 'tsoa';
import { Responses } from '../Response';
import { ConfigurationService } from '../service/configurationService';
import { ConfigData } from '../models/configuration';

@Route('api/v1/config')
export class ConfigurationController extends ControllerBase {
  // 1.2.0
  @Security('jwt', ['admin'])
  @Get()
  public async getConfig(@Query() page?: number, @Query() size?: number, @Query() search?: string) {
    return this.exec(async () => {
      const response = await new ConfigurationService().getConfig(page, size, search);
      return Responses.ok(response.body);
    });
  }

  // 1.2.0
  @Security('jwt', ['admin'])
  @Post()
  public async addConfig(@Body() requestBody: ConfigData, @Request() request: any) {
    return this.exec(async () => {
      const response = await new ConfigurationService().addConfig(requestBody);
      return Responses.ok(response.body);
    });
  }

  // 1.2.0
  @Security('jwt', ['admin'])
  @Patch('{id}')
  public async editConfig(@Path() id: number, @Body() requestBody: ConfigData, @Request() request: any): Promise<any> {
    return this.exec(async () => {
      const designation = await new ConfigurationService().editConfig(id, requestBody);
      return designation.body;
    });
  }

  // 1.2.0
  @Security('jwt', ['admin'])
  @Delete('{id}')
  public async deleteConfig(@Path() id: number, @Request() request: any): Promise<any> {
    return this.exec(async () => {
      const designation = await new ConfigurationService().deleteConfig(id);
      return designation.body;
    });
  }
}
