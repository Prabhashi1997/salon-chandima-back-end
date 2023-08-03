"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const Response_1 = require("../Response");
const jwt = __importStar(require("jsonwebtoken"));
const database_1 = require("./database");
const User_1 = require("../entity/User");
const Password_1 = require("../entity/Password");
const Common_1 = require("../entity/Common");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const PasswordRest_1 = require("../entity/PasswordRest");
const notificationService_1 = require("./notificationService");
class UsersService {
    async get(id) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .createQueryBuilder('user')
            .where('user.id = :membersId', {
            membersId: id,
        })
            .getOne();
        return Object.assign({}, user);
    }
    async getAll() {
        const user1 = await database_1.DatabaseService.getInstance().getRepository(User_1.User).find();
        return Response_1.Responses.ok(user1);
    }
    async getUsers(page, size, search, email, employeeId, epfNumber) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.supervisor', 'supervisor')
            .leftJoinAndSelect('user.designation', 'designation')
            .leftJoinAndSelect('user.teams', 'teams');
        if (search) {
            qb.andWhere('lower(user.email) LIKE :search OR lower(user.firstName) LIKE :search OR lower(user.lastName) LIKE :search  OR lower(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        if (email) {
            qb.andWhere('user.email = :email', { email });
        }
        const [users, total] = await qb
            .orderBy('user.email', 'ASC', 'NULLS FIRST')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return {
            data: users
                .map((user) => (Object.assign({}, user)))
                .map((value) => {
                if (value.image === null) {
                    delete value.image;
                }
                return value;
            }),
            total,
        };
    }
    async search(keyword) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .find({
            where: [
                { name: (0, typeorm_1.Like)(`%${keyword}%`) },
                { designation: (0, typeorm_1.Like)(`%${keyword}%`) },
                { supervisor: (0, typeorm_1.Like)(`%${keyword}%`) },
            ],
        });
        return Response_1.Responses.ok(user);
    }
    async searchByUserName(keyword) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .find({
            where: [{ name: (0, typeorm_1.Like)(`%${keyword}%`) }],
        });
        return Response_1.Responses.ok(user);
    }
    async createSession(email, password) {
        var _a;
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({
            where: [{ email: email.toLowerCase() }],
        });
        if (!user) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid email or password');
        }
        else {
            const x = await database_1.DatabaseService.getInstance()
                .getRepository(Password_1.Password)
                .findOne({
                where: [{ user: user }],
                order: { id: 'DESC' },
            });
            if (!x || !bcryptjs_1.default.compareSync(password, x.password)) {
                throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid email or password');
            }
            const key = await database_1.DatabaseService.getInstance()
                .getRepository(Common_1.Common)
                .findOne({ where: { key: 'privateKey' } });
            if (key) {
                const payload = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    userId: user.id,
                    role: [...((_a = user === null || user === void 0 ? void 0 : user.roles) !== null && _a !== void 0 ? _a : [])]
                };
                console.log(payload);
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
                return jwt.sign(payload, key.val, signOptions);
            }
            else {
                throw new Response_1.ServiceError(Response_1.ResponseCode.internalServerError, 'Configuration issue.');
            }
        }
    }
    async refreshToken(userId) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({
            where: [{ id: userId }],
        });
        if (!user) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid email or password');
        }
        else {
            const key = await database_1.DatabaseService.getInstance()
                .getRepository(Common_1.Common)
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
                    algorithm: 'RS256',
                };
                return jwt.sign(payload, key.val, signOptions);
            }
            else {
                throw new Response_1.ServiceError(Response_1.ResponseCode.internalServerError, 'Configuration issue.');
            }
        }
    }
    async passwordChange(userId, currentPassword, newPassword) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({
            where: [{ id: userId }],
        });
        const password = await database_1.DatabaseService.getInstance()
            .getRepository(Password_1.Password)
            .findOne({
            where: [{ user: user }],
            order: { id: 'DESC' },
        });
        if (!password || !bcryptjs_1.default.compareSync(currentPassword, password.password)) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid Current Password');
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(newPassword, salt);
        await database_1.DatabaseService.getInstance().manager.update(Password_1.Password, password.id, {
            user: user,
            password: hash,
        });
        return Response_1.Responses.ok();
    }
    async resetPassword(userId, newPassword) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({
            where: [{ id: userId }],
        });
        const password = await database_1.DatabaseService.getInstance()
            .getRepository(Password_1.Password)
            .findOne({
            where: [{ user: user }],
            order: { id: 'DESC' },
        });
        if (!password) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid Current Password');
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(newPassword, salt);
        await database_1.DatabaseService.getInstance().manager.update(Password_1.Password, password.id, {
            user: user,
            password: hash,
        });
        return Response_1.Responses.ok();
    }
    async requestPasswordReset(email) {
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({
            where: [{ email: email }],
        });
        if (!user) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.notFound, 'User Not found');
        }
        const rToken = await database_1.DatabaseService.getInstance()
            .getRepository(PasswordRest_1.PasswordRest)
            .createQueryBuilder('token')
            .leftJoinAndSelect('token.user', 'user')
            .where('token.userId = :id', { id: user.id })
            .getOne();
        if (rToken) {
            await database_1.DatabaseService.getInstance().manager.delete(PasswordRest_1.PasswordRest, {
                id: rToken.id,
            });
        }
        const timestamp = Date.now() + 30 * 60 * 1000;
        const passwordRest = await database_1.DatabaseService.getInstance().manager.insert(PasswordRest_1.PasswordRest, {
            timestamp: timestamp + '',
            user,
        });
        const token = passwordRest.identifiers[0].id;
        try {
            await new notificationService_1.NotificationService().sendNotifications('Password Reset', [user.id], {
                link: `${process.env.FRONTEND_URL}/password-reset?token=${token}`,
            });
        }
        catch (e) {
            console.log(e);
        }
        return Response_1.Responses.ok();
    }
    async resetPasswordFromToken(token, newPassword) {
        const rToken = await database_1.DatabaseService.getInstance()
            .getRepository(PasswordRest_1.PasswordRest)
            .createQueryBuilder('token')
            .leftJoinAndSelect('token.user', 'user')
            .where('token.id = :id', { id: token })
            .getOne();
        const now = Date.now();
        if (!rToken) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.notFound, 'User Not found');
        }
        else if (now > +rToken.timestamp) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.requestTimeout, 'Session Time out');
        }
        const user = await database_1.DatabaseService.getInstance()
            .getRepository(User_1.User)
            .findOne({
            where: [{ id: rToken.user.id }],
        });
        if (!user) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.notFound, 'User Not found');
        }
        const password = await database_1.DatabaseService.getInstance()
            .getRepository(Password_1.Password)
            .findOne({
            where: [{ user: user }],
            order: { id: 'DESC' },
        });
        if (!password) {
            throw new Response_1.ServiceError(Response_1.ResponseCode.forbidden, 'Invalid Current Password');
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(newPassword, salt);
        await database_1.DatabaseService.getInstance().manager.update(Password_1.Password, password.id, {
            user: user,
            password: hash,
        });
        await database_1.DatabaseService.getInstance().manager.delete(PasswordRest_1.PasswordRest, {
            id: rToken.id,
        });
        return Response_1.Responses.ok();
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=usersService.js.map