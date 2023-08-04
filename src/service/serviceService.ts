import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Service} from "../entity/Service";
import {ServiceData} from "../models/Service";

export class ServiceService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Service)
            .createQueryBuilder('service');

        const [services, total] = await qb
            .orderBy('service.name')
            .getManyAndCount();

        return Responses.ok({
            services: services.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    duration: item.duration,
                };
            }),
            total,
        });
    }

    public async get(id) {
        const qb = await DatabaseService.getInstance()
            .getRepository(Service)
            .createQueryBuilder('service')
            .where({id})
            .getOne();

        return {
            data: {
                name: qb.name,
                description: qb.description,
                price: qb.price,
                image: qb.image,
                duration: qb.duration,
            }
        };
    }

    public async getServices(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Service)
            .createQueryBuilder('service');
        if (search) {
            qb.andWhere('lower(service.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [services, total] = await qb
            .orderBy('service.name')
            // .take(size ?? 10)
            // .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            services: services.map((item) => {
                return {...item};
            }),
            total,
        });
    }

    public async addService(requestBody: ServiceData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newService = new Service();
            newService.name = requestBody.name;
            newService.duration = requestBody.duration;
            newService.price = requestBody.price;
            if (!!requestBody.image) {
                newService.image = requestBody.image;
            }
            if (!!requestBody.description) {
                newService.description = requestBody.description;
            }
            await queryRunner.manager.save(newService);

            requestBody.id = newService.id;
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

    public async deleteService(id: number): Promise<any> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const service = await queryRunner.manager
                .getRepository(Service)
                .findOne({ where: {id: id} });

            if (service) {
                const service = await DatabaseService.getInstance().manager.delete
                await queryRunner.manager.delete(Service, { id: id });
            }
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

    public async editService(id: number, data: ServiceData): Promise<{ body: any; statusCode: number }> {
        const service = await DatabaseService.getInstance()
            .getRepository(Service)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            service.name = data.name;
            service.description = data.description;
            service.price = data.price;
            service.image = data.image;
            service.duration = data.duration;

            await queryRunner.manager.save(service);
            await queryRunner.commitTransaction();
            return Responses.ok(service);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
