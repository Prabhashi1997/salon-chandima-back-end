import { DatabaseService } from './database';
import { Responses } from '../Response';
import { Configuration } from '../entity/Configuration';
import { ConfigData } from '../models/configuration';

export class ConfigurationService {
  public async getConfig(page?: number, size?: number, search?: string) {
    const qb = DatabaseService.getInstance().getRepository(Configuration).createQueryBuilder('config');
    if (search) {
      qb.andWhere('lower(config.key) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [config, total] = await qb
      .take(size ?? 10)
      .skip(page ? (page - 1) * (size ?? 10) : 0)
      .getManyAndCount();

    return Responses.ok({ config, total });
  }

  public async addConfig(requestBody: ConfigData): Promise<{ body: any; statusCode: number }> {
    const cycle = await DatabaseService.getInstance().manager.insert(Configuration, {
      key: requestBody.key,
      value: requestBody.value,
    });
    requestBody.id = cycle.identifiers[0].id;
    return Responses.ok(requestBody);
  }

  public async deleteConfig(id: number): Promise<{ body: any; statusCode: number }> {
    await DatabaseService.getInstance().manager.delete(Configuration, { id: id });
    return Responses.ok(id);
  }

  public async editConfig(id: number, data: ConfigData): Promise<{ body: any; statusCode: number }> {
    const config = await DatabaseService.getInstance()
      .getRepository(Configuration)
      .findOne({ where: { id: id } });

    config.key = data.key;
    config.value = data.value;
    await DatabaseService.getInstance().manager.save(config);
    return Responses.ok(config);
  }
}
