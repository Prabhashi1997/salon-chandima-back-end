import { DatabaseService } from './database';
import { Responses } from '../Response';
import { PerformanceCycle } from '../entity/PerformanceCycle';
import { PerformanceCycleData } from '../models/PerformanceCycle';

export class PerformancesCycleService {
  public async getCycles(page?: number, size?: number, search?: string) {
    const qb = DatabaseService.getInstance()
      .getRepository(PerformanceCycle)
      .createQueryBuilder('PerformanceCycle')
      .leftJoinAndSelect('PerformanceCycle.cycleNotifications', 'cycleNotifications');
    if (search) {
      qb.andWhere('lower(PerformanceCycle.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [performanceCycle, total] = await qb
      .orderBy('PerformanceCycle.startDate')
      .take(size ?? 10)
      .skip(page ? (page - 1) * (size ?? 10) : 0)
      .getManyAndCount();

    return Responses.ok({
      performanceCycle: performanceCycle.map((item) => {
        const n = { ...item };
        return n;
      }),
      total,
    });
  }
  public async addCycle(requestBody: PerformanceCycleData): Promise<{ body: any; statusCode: number }> {
    const queryRunner = DatabaseService.getInstance().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const newCycle = new PerformanceCycle();
      newCycle.name = requestBody.name;
      newCycle.startDate = requestBody.startDate;
      newCycle.endDate = requestBody.endDate;
      newCycle.status = requestBody.status;
      await queryRunner.manager.save(newCycle);

      requestBody.id = newCycle.id;
      await queryRunner.commitTransaction();
      return Responses.ok(requestBody);
    } catch (e) {
      console.log(e);
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }

  public async deleteCycle(id: number): Promise<{ body: any; statusCode: number }> {
    const queryRunner = DatabaseService.getInstance().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(PerformanceCycle, { id: id });
      await queryRunner.commitTransaction();
      return Responses.ok(id);
    } catch (e) {
      // since we have errors let's rollback changes we made
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }

  public async editCycle(id: number, data: PerformanceCycleData): Promise<{ body: any; statusCode: number }> {
    const cycle = await DatabaseService.getInstance()
      .getRepository(PerformanceCycle)
      .findOne({ where: { id: id } });
    const queryRunner = DatabaseService.getInstance().createQueryRunner();
    await queryRunner.startTransaction();
    const oldCycle = { ...cycle };

    try {
      cycle.name = data.name;
      cycle.startDate = data.startDate;
      cycle.endDate = data.endDate;
      cycle.status = data.status;

      await queryRunner.manager.save(cycle);
      await queryRunner.commitTransaction();
      return Responses.ok(cycle);
    } catch (e) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
