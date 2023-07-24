import { UserCreationParams } from '../models/user';
import { ControllerResponse, ResponseCode, Responses, ServiceError } from '../Response';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from './database';
import { User, User as UserEntity } from '../entity/User';
import { Password as PasswordEntity } from '../entity/Password';
import { Common } from '../entity/Common';
import { Like, QueryFailedError } from 'typeorm';
import bcrypt from 'bcryptjs';
import Utils from '../common/Utils';
import { DataTableResponse } from '../common/Definitions';
import { PasswordRest } from '../entity/PasswordRest';
import { NotificationService } from './notificationService';
import { Algorithm } from 'jsonwebtoken';

export class UsersService {
  public async get(id: number): Promise<Responses> {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.id = :membersId', {
        membersId: id,
      })
      .getOne();

    return {
      ...user,
    };
  }
  public async getAll(): Promise<Responses> {
    const user1 = await DatabaseService.getInstance().getRepository(UserEntity).find();
    return Responses.ok(user1);
  }

  public async getUsers(
    page?: number,
    size?: number,
    search?: string,
    email?: string,
    employeeId?: string,
    epfNumber?: string,
  ): Promise<DataTableResponse<User>> {
    const qb = DatabaseService.getInstance()
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.supervisor', 'supervisor')
      .leftJoinAndSelect('user.designation', 'designation')
      .leftJoinAndSelect('user.teams', 'teams');
    if (search) {
      qb.andWhere(
        'lower(user.email) LIKE :search OR lower(user.firstName) LIKE :search OR lower(user.lastName) LIKE :search  OR lower(user.name) LIKE :search',
        {
          search: `%${search.toLowerCase()}%`,
        },
      );
    }

    if (email) {
      qb.andWhere('user.email = :email', { email });
    }


    const [users, total] = await qb
      .orderBy('user.email', 'ASC', 'NULLS FIRST')
      .take(size ?? 10)
      .skip(page ? (page - 1) * (size ?? 10) : 0)
      .getManyAndCount();

    return {
      data: users
        .map((user) => ({
          ...user,
        }))
        .map((value) => {
          if (value.image === null) {
            delete value.image;
          }
          return value as any;
        }),
      total,
    };
  }

  public async search(keyword: string): Promise<Responses> {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .find({
        where: [
          { name: Like(`%${keyword}%`) },
          { designation: Like(`%${keyword}%`) },
          { supervisor: Like(`%${keyword}%`) },
        ],
      });
    return Responses.ok(user);
  }

  public async searchByUserName(keyword: string): Promise<Responses> {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .find({
        where: [{ name: Like(`%${keyword}%`) }],
      });
    return Responses.ok(user);
  }

  public async createSession(email: string, password: string): Promise<string> {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({
        where: [{ email: email.toLowerCase() }],
      });
    if (!user) {
      throw new ServiceError(ResponseCode.forbidden, 'Invalid email or password');
    } else {
      const x = await DatabaseService.getInstance()
        .getRepository(PasswordEntity)
        .findOne({
          where: [{ user: user }],
          order: { id: 'DESC' },
        });

      if (!x || !bcrypt.compareSync(password, x.password)) {
        throw new ServiceError(ResponseCode.forbidden, 'Invalid email or password');
      }

      const key = await DatabaseService.getInstance()
        .getRepository(Common)
        .findOne({ where: { key: 'privateKey' } });
      if (key) {
        const payload = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          userId: user.id,
          role: [...(user?.roles ?? [])]
        };
        console.log(payload)
        const iss = 'salon-chandima';
        const sub = 'user';
        const aud = 'http://localhost:4200';
        const exp = '58365h';
        const signOptions = {
          issuer: iss,
          subject: sub,
          audience: aud,
          expiresIn: exp,
          algorithm: 'RS256',
        };
        return jwt.sign(payload, key.val, signOptions) as string;
      } else {
        throw new ServiceError(ResponseCode.internalServerError, 'Configuration issue.');
      }
    }
  }

  public async refreshToken(userId: number): Promise<string> {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({
        where: [{ id: userId }],
      });

    if (!user) {
      throw new ServiceError(ResponseCode.forbidden, 'Invalid email or password');
    } else {
      const key = await DatabaseService.getInstance()
        .getRepository(Common)
        .findOne({ where: { key: 'privateKey' } });
      if (key) {
        const payload = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          userId: user.id,
          role: [...user.roles],
        };
        const iss = 'salon-chandima';
        const sub = 'user';
        const aud = 'http://localhost:4200';
        const exp = '58365h';
        const signOptions = {
          issuer: iss,
          subject: sub,
          audience: aud,
          expiresIn: exp,
          algorithm: 'RS256' as Algorithm,
        };
        return jwt.sign(payload, key.val, signOptions) as string;
      } else {
        throw new ServiceError(ResponseCode.internalServerError, 'Configuration issue.');
      }
    }
  }

  public async passwordChange(userId: number, currentPassword: string, newPassword: string) {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({
        where: [{ id: userId }],
      });

    const password = await DatabaseService.getInstance()
      .getRepository(PasswordEntity)
      .findOne({
        where: [{ user: user }],
        order: { id: 'DESC' },
      });
    if (!password || !bcrypt.compareSync(currentPassword, password.password)) {
      throw new ServiceError(ResponseCode.forbidden, 'Invalid Current Password');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    await DatabaseService.getInstance().manager.update(PasswordEntity, password.id, {
      user: user,
      password: hash,
    });

    return Responses.ok();
  }

  public async resetPassword(userId: number, newPassword: string) {
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({
        where: [{ id: userId }],
      });

    const password = await DatabaseService.getInstance()
      .getRepository(PasswordEntity)
      .findOne({
        where: [{ user: user }],
        order: { id: 'DESC' },
      });
    if (!password) {
      throw new ServiceError(ResponseCode.forbidden, 'Invalid Current Password');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    await DatabaseService.getInstance().manager.update(PasswordEntity, password.id, {
      user: user,
      password: hash,
    });

    return Responses.ok();
  }
  public async requestPasswordReset(email: string) {
    // logger.info
    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({
        where: [{ email: email }],
      });

    if (!user) {
      // logger.info
      throw new ServiceError(ResponseCode.notFound, 'User Not found');
    }
    const rToken = await DatabaseService.getInstance()
      .getRepository(PasswordRest)
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token.userId = :id', { id: user.id })
      .getOne();

    if (rToken) {
      // logger.info
      await DatabaseService.getInstance().manager.delete(PasswordRest, {
        id: rToken.id,
      });
    }

    const timestamp = Date.now() + 30 * 60 * 1000;
    const passwordRest = await DatabaseService.getInstance().manager.insert(PasswordRest, {
      timestamp: timestamp + '',
      user,
    });
    const token = passwordRest.identifiers[0].id;
    try {
      await new NotificationService().sendNotifications('Password Reset', [user.id], {
        link: `${process.env.FRONTEND_URL}/password-reset?token=${token}`,
      });
    } catch (e) {
      console.log(e);
    }
    return Responses.ok();
  }
  public async resetPasswordFromToken(token: string, newPassword: string) {
    const rToken = await DatabaseService.getInstance()
      .getRepository(PasswordRest)
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token.id = :id', { id: token })
      .getOne();
    const now = Date.now();

    if (!rToken) {
      throw new ServiceError(ResponseCode.notFound, 'User Not found');
    } else if (now > +rToken.timestamp) {
      throw new ServiceError(ResponseCode.requestTimeout, 'Session Time out');
    }

    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({
        where: [{ id: rToken.user.id }],
      });

    if (!user) {
      throw new ServiceError(ResponseCode.notFound, 'User Not found');
    }

    const password = await DatabaseService.getInstance()
      .getRepository(PasswordEntity)
      .findOne({
        where: [{ user: user }],
        order: { id: 'DESC' },
      });
    if (!password) {
      throw new ServiceError(ResponseCode.forbidden, 'Invalid Current Password');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    await DatabaseService.getInstance().manager.update(PasswordEntity, password.id, {
      user: user,
      password: hash,
    });

    await DatabaseService.getInstance().manager.delete(PasswordRest, {
      id: rToken.id,
    });

    return Responses.ok();
  }
}
