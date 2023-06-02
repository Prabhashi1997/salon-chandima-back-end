import { DatabaseService } from './database';
import { Configuration } from '../entity/Configuration';
import { In } from 'typeorm';

export class ConfigService {
  async getConfig(...configs: string[]) {
    const response = await DatabaseService.getInstance()
      .getRepository(Configuration)
      .createQueryBuilder('configuration')
      .where({ key: In(configs) })
      .getMany();

    const result = {};
    response.forEach((item) => {
      const itemKey = item.key;
      result[itemKey] = item.value;
    });

    return result;
  }
}
