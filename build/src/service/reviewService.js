"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Review_1 = require("../entity/Review");
const Customer_1 = require("../entity/Customer");
class ReviewService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Review_1.Review)
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user');
        const [reviews, total] = await qb
            .orderBy('user.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            reviews: reviews.map((item) => {
                const user = item.customer.user;
                return {
                    name: user.firstName + ' ' + user.lastName,
                    image: user.image,
                    createdAt: item.createdAt,
                    comment: item.comment,
                    rate: item.rate,
                };
            }),
            total,
        });
    }
    async getReview(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Review_1.Review)
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user');
        if (search) {
            qb.andWhere('lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [reviews, total] = await qb
            .orderBy('user.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            reviews: reviews.map((item) => {
                const user = item.customer.user;
                return Object.assign({ name: user.firstName + ' ' + user.lastName }, item);
            }),
            total,
        });
    }
    async addReview(requestBody, userId) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const qb = database_1.DatabaseService.getInstance()
                .getRepository(Review_1.Review)
                .createQueryBuilder('review')
                .leftJoinAndSelect('review.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('user.id = :userID', { userID: userId })
                .getOne();
            const qb1 = await database_1.DatabaseService.getInstance()
                .getRepository(Customer_1.Customer)
                .createQueryBuilder('customer')
                .leftJoinAndSelect('customer.user', 'user')
                .where('user.id = :userID', { userID: userId })
                .getOne();
            const newReview = new Review_1.Review();
            newReview.comment = requestBody.comment;
            newReview.rate = requestBody.rate;
            newReview.customer = qb1;
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
            console.log(e);
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
            review.rate = data.rate;
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