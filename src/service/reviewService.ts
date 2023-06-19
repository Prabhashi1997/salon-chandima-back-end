import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Review} from "../entity/Review";
import { ReviewData } from '../models/review';

export class ReviewService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Review)
            .createQueryBuilder('review');

        const [reviews, total] = await qb
            .orderBy('review.name')
            .getManyAndCount();

        return Responses.ok({
            services: reviews.map((item) => {
                return {
                    dateAndTime: item.dateAndTime,
                    status: item.status,
                    duration: item.duration,
                    deleted: item.deleted,        
                };
            }),
            total,
        });
    }
    public async getReview(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Review)
            .createQueryBuilder('review');
        if (search) {
            qb.andWhere('lower(review.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [reviews, total] = await qb
            .orderBy('review.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            reviews: reviews.map((item) => {
                return {...item};
            }),
            total,
        });
    }
    public async addReview(requestBody: ReviewData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newReview = new Review();
            newReview.dateAndTime = requestBody.dateAndTime;
            newReview.status = requestBody.status;
            newReview.duration = requestBody.duration;
            newReview.deleted = requestBody.deleted;
            await queryRunner.manager.save(newReview);

            requestBody.id = newReview.id;
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
    public async deleteReview(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Review, { id: id });
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
    public async editReview(id: number, data: ReviewData): Promise<{ body: any; statusCode: number }> {
        const appointment = await DatabaseService.getInstance()
            .getRepository(Review)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            review.dateAndTime = data.dateAndTime;
            review.status = data.status;
            review.duration = data.duration;
            review.deleted = data.deleted;

            await queryRunner.manager.save(review);
            await queryRunner.commitTransaction();
            return Responses.ok(review);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
