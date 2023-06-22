"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Review_1 = require("../entity/Review");
class ReviewService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Review_1.Review)
            .createQueryBuilder('review');
        const [reviews, total] = await qb
            .orderBy('review.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            reviews: reviews.map((item) => {
                return {
                    comment: item.comment,
                };
            }),
            total,
        });
    }
    async getReview(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Review_1.Review)
            .createQueryBuilder('review');
        if (search) {
            qb.andWhere('lower(review.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [reviews, total] = await qb
            .orderBy('review.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            reviews: reviews.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addReview(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newReview = new Review_1.Review();
            newReview.comment = requestBody.comment;
            await queryRunner.manager.save(newReview);
            requestBody.id = newReview.id;
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(requestBody);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteReview(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Review_1.Review, { id: id });
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(id);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async editReview(id, data) {
        const review = await database_1.DatabaseService.getInstance()
            .getRepository(Review_1.Review)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            review.comment = data.comment;
            await queryRunner.manager.save(review);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(review);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=reviewService.js.map