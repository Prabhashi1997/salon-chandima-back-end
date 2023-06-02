import { NotificationData } from '../models/notification';
import { DatabaseService } from './database';
import { Notification } from '../entity/Notification';
import { Responses } from '../Response';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { NotificationConfig } from '../Notification';
import { User } from '../entity/User';
import Handlebars from 'handlebars';

export class NotificationService {
  public async createNotification(data: NotificationData) {
    const date = new Date();
    const notification = await DatabaseService.getInstance().manager.insert(Notification, {
      title: data.title,
      description: data.description,
      read: false,
      url: data.url,
      time: date,
      image: data.image,
      userId: data.user,
    });

    data.id = notification.identifiers[0].id;
    return Responses.ok(data);
  }

  public async getNotification(userId: number, page?: number, size?: number, time?: string) {
    const timeX = new Date(time);

    const query = time ? { userId: userId, time: MoreThanOrEqual(timeX), read: false } : { userId: userId };
    const notification = await DatabaseService.getInstance()
      .manager.getRepository(Notification)
      .find({
        where: query,
        order: { id: 'DESC' },
        take: size ?? 20,
        skip: page ? (page - 1) * (size ?? 100) : 0,
      });

    return Responses.ok(notification);
  }

  public async markAsRead(userId: number, notificationId: number, all?: boolean) {
    let notification;
    if (all == true) {
      notification = await DatabaseService.getInstance()
        .getRepository(Notification)
        .find({ where: { id: LessThanOrEqual(notificationId), userId } });

      notification.forEach((item) => {
        item.read = true;
      });
      await DatabaseService.getInstance().manager.save(notification);
    } else {
      notification = await DatabaseService.getInstance()
        .getRepository(Notification)
        .findOne({ where: { id: notificationId } });

      notification.read = true;
      await DatabaseService.getInstance().manager.save(notification);
    }
    return Responses.ok(notification);
  }

  public async sendNotifications(name: string, receivers: number[], params: any, image?: string) {
    const notification = NotificationConfig.find((notification) => notification.name === name);
    const userList = await DatabaseService.getInstance()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('id IN (:...userId)', { userId: [...receivers] })
      .getMany();

    for (const user of userList) {
      if (notification.alert) {
        const data = {
          title: Handlebars.compile(notification.alert.title)(params),
          description: Handlebars.compile(notification.alert.template)(params),
          url: Handlebars.compile(notification.alert.url)(params),
          image: image ?? user.image,
          user: user.id,
        };
        this.createNotification(data);
      }
    }
  }
}
