import { Body, Delete, Get, Patch, Path, Post, Query, Request, Route, Security } from 'tsoa';
import ControllerBase from '../common/ControllerBase';
import { Responses } from '../Response';
import { PerformancesCycleService } from '../service/performancesCycleService';
import { PerformanceCycleData } from '../models/PerformanceCycle';

@Route('api/v1/cycles')
export class PerformanceCycleController extends ControllerBase {
  // 1.2.0
  @Security('jwt', ['admin', 'user', 'manager', 'hr'])
  @Get()
  public async getCycle(@Query() page?: number, @Query() size?: number, @Query() search?: string): Promise<void> {
    return this.exec(async () => {
      const response = await new PerformancesCycleService().getCycles(page, size, search);
      return Responses.ok(response.body);
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'hr'])
  @Post()
  public async addCycle(@Body() requestBody: PerformanceCycleData, @Request() request: any) {
    return this.exec(async () => {
      const response = await new PerformancesCycleService().addCycle(requestBody);
      return Responses.ok(response.body);
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'hr'])
  @Patch('{id}')
  public async editCycle(
    @Path() id: number,
    @Body() requestBody: PerformanceCycleData,
    @Request() request: any,
  ): Promise<any> {
    return this.exec(async () => {
      const designation = await new PerformancesCycleService().editCycle(id, requestBody);
      return designation.body;
    });
  }

  // 1.2.0
  @Security('jwt', ['admin', 'hr'])
  @Delete('{id}')
  public async deleteCycle(@Path() id: number, @Request() request: any): Promise<any> {
    return this.exec(async () => {
      const designation = await new PerformancesCycleService().deleteCycle(id);
      return designation?.body ?? designation;
    });
  }
}
