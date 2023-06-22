"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = require("./database");
const Notification_1 = require("../entity/Notification");
const Response_1 = require("../Response");
const typeorm_1 = require("typeorm");
const Notification_2 = require("../Notification");
const User_1 = require("../entity/User");
const handlebars_1 = __importDefault(require("handlebars"));
class NotificationService {
    async createNotification(data) {
        const date = new Date();
        const notification = await database_1.DatabaseService.getInstance().manager.insert(Notification_1.Notification, {
            title: data.title,
            description: data.description,
            read: false,
            url: data.url,
            time: date,
            image: data.image,
            userId: data.user,
        });
        data.id = notification.identifiers[0].id;
        return Response_1.Responses.ok(data);
    }
    async getNotification(userId, page, size, time) {
        const timeX = new Date(time);
        const query = time ? { userId: userId, time: (0, typeorm_1.MoreThanOrEqual)(timeX), read: false } : { userId: userId };
        const notification = await database_1.DatabaseService.getInstance()
            .manager.getRepository(Notification_1.Notification)
            .find({
            where: query,
            order: { id: 'DESC' },
            take: size !== null && size !== void 0 ? size : 20,
            skip: page ? (page - 1) * (size !== null && size !== void 0 ? size : 100) : 0,
        });
        return Response_1.Responses.ok(notification);
    }
    async markAsRead(userId, notificationId, all) {
        let notification;
        if (all == true) {
            notification = await database_1.DatabaseService.getInstance()
                .getRepository(Notification_1.Notification)
                .find({ where: { id: (0, typeorm_1.LessThanOrEqual)(notificationId), userId } });
            notification.forEach((item) => {
                item.read = true;
            });
            await database_1.DatabaseService.getInstance().manager.save(notification);
        }
        else {
            notification = await database_1.DatabaseService.getInstance()
                .getRepository(Notification_1.Notification)
                .findOne({ where: { id: notificationId } });
            notification.read = true;
            await database_1.DatabaseService.getInstance().manager.save(notification);
        }
        return Response_1.Responses.ok(notification);
    }
    async sendNotifications(name, receivers, params, image) {
        const notification = Notification_2.NotificationConfig.find((notification) => notification.name === name);
        const userList = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .createQueryBuilder('user')
            .where('id IN (:...userId)', { userId: [...receivers] })
            .getMany();
        for (const user of userList) {
            if (notification.alert) {
                const data = {
                    title: handlebars_1.default.compile(notification.alert.title)(params),
                    description: handlebars_1.default.compile(notification.alert.template)(params),
                    url: handlebars_1.default.compile(notification.alert.url)(params),
                    image: image !== null && image !== void 0 ? image : user.image,
                    user: user.id,
                };
                this.createNotification(data);
            }
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map