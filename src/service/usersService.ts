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

    if (employeeId) {
      qb.andWhere('user.employeeId = :employeeId', { employeeId });
    }

    if (epfNumber) {
      qb.andWhere('user.epfNo = :epfNumber', { epfNumber: +epfNumber });
    }

    const [users, total] = await qb
      .orderBy('user.epfNo', 'ASC', 'NULLS FIRST')
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

  public async edit(userId: number, body: UserCreationParams, roles: string[], reqUserId: number): Promise<User> {
    const queryRunner = DatabaseService.getInstance().createQueryRunner();
    await queryRunner.startTransaction();

    const user = await DatabaseService.getInstance()
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });

    if (roles.find((e) => e === 'hr' || e === 'admin' || e === 'manger') || reqUserId === user.id) {
      if (reqUserId === user.id) {
        user.image = body?.image ?? user.image;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.name = `${body.firstName} ${body.lastName}`.toLowerCase();
      } else if (roles.find((e) => e === 'hr' || e === 'admin' || e === 'manger')) {
        const roles1 = body?.roles;
        delete body?.roles;
        Object.entries(body).forEach((v) => (user[v[0]] = v[1]));
        if (
          roles.find((e) => e === 'admin') ||
          (roles.find((e) => e === 'hr') && !roles1.find((e) => e === 'hr' || e === 'admin')) ||
          (roles.find((e) => e === 'manger') && !roles1.find((e) => e === 'hr' || e === 'admin' || e === 'manger'))
        ) {
          user.roles = roles1;
        }
        user.name = `${body.firstName} ${body.lastName}`.toLowerCase();
      }
      try {
        await queryRunner.manager.update(User, userId, user);
        // commit transaction now:
        await queryRunner.commitTransaction();
      } catch (e) {
        // since we have errors let's rollback changes we made
        await queryRunner.rollbackTransaction();
        console.log(e);
        if (e instanceof QueryFailedError) {
          const err: any = e;
          if (err.code === '23505') {
            throw new ServiceError(ResponseCode.conflict, 'Duplicate entry', {
              errors: Utils.getIndexErrorMessage(UserEntity.Index, err.constraint),
            });
          }
          throw new ServiceError(ResponseCode.unprocessableEntity, 'Unprocessable entity');
        }
      } finally {
        // you need to release query runner which is manually created:
        await queryRunner.release();
      }
    } else {
      throw new ServiceError(ResponseCode.forbidden, 'Invalid authentication credentials');
    }
    return user;
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
        const iss = 'Salon-Chandima';
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
        const iss = 'StridePal';
        const sub = 'user';
        const aud = 'http://localhost:4000';
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
