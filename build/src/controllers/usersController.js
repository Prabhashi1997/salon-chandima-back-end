"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const tsoa_1 = require("tsoa");
const Response_1 = require("../Response");
const usersService_1 = require("../service/usersService");
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
let UsersController = exports.UsersController = class UsersController extends ControllerBase_1.default {
    async getUser(request, userId) {
        return this.exec(async () => {
            if ((request === null || request === void 0 ? void 0 : request.user.role.find((e) => e === 'hr' || e === 'admin' || e === 'manger')) ||
                userId === +(request === null || request === void 0 ? void 0 : request.user.userId)) {
                const user = await new usersService_1.UsersService().get(userId);
                return Response_1.Responses.ok(Object.assign({}, user));
            }
            else {
                return Response_1.Responses.forbidden();
            }
        });
    }
    async deleteUser(userId) {
        const user = await new usersService_1.UsersService().delete(userId);
        this.setStatus(user['statusCode']);
        return user['body'];
    }
    async requestPasswordReset(body) {
        return this.exec(async () => {
            const user = await new usersService_1.UsersService().requestPasswordReset(body.email);
            return Response_1.Responses.ok({ user });
        });
    }
    async resetPasswordFromToken(body) {
        return this.exec(async () => {
            const user = await new usersService_1.UsersService().resetPasswordFromToken(body.token, body.password);
            return Response_1.Responses.ok({ user });
        });
    }
    async editUser(request, userId, requestBody) {
        return await this.exec(async () => {
            var _a, _b;
            const user = await new usersService_1.UsersService().edit(userId, requestBody === null || requestBody === void 0 ? void 0 : requestBody.user, (_b = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : [], +(request === null || request === void 0 ? void 0 : request.user.userId));
            const token = await new usersService_1.UsersService().refreshToken(userId);
            return Response_1.Responses.ok({ user, token });
        });
    }
    async getUsers(page, size, search, email, employeeId, epfNumber) {
        return this.exec(async () => {
            const response = await new usersService_1.UsersService().getUsers(page, size, search, email, employeeId, epfNumber);
            return Response_1.Responses.ok(response);
        });
    }
    async createUser(request, requestBody) {
        return await this.exec(async () => {
            await this.handleFile(request);
            const user = await new usersService_1.UsersService().create(requestBody.user, requestBody.password);
            return Response_1.Responses.ok({ user });
        });
    }
    handleFile(request) {
        const multerSingle = (0, multer_1.default)().single('avatar');
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, async (error) => {
                if (error) {
                    reject(error);
                }
                resolve(undefined);
            });
        });
    }
    async login(requestBody) {
        const { email, password } = requestBody;
        return await this.exec(async () => {
            const token = await new usersService_1.UsersService().createSession(email, password);
            return Response_1.Responses.ok({ token });
        });
    }
    async refreshToken(userId, request) {
        return await this.exec(async () => {
            const token = await new usersService_1.UsersService().refreshToken(+request.user.userId);
            return Response_1.Responses.ok({ token });
        });
    }
    async changePassword(userId, value, request) {
        return await this.exec(async () => {
            const response = await new usersService_1.UsersService().passwordChange(+request.user.userId, value.currentPassword, value.newPassword);
            return Response_1.Responses.ok({ response });
        });
    }
    async resetPassword(userId, value) {
        return await this.exec(async () => {
            const response = await new usersService_1.UsersService().resetPassword(userId, value.newPassword);
            return Response_1.Responses.ok({ response });
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Response)(500, 'internal server error', {
        code: '500',
        message: 'internal server error',
        body: {},
    }),
    (0, tsoa_1.Response)(401, 'unauthorized', {
        code: '401',
        message: 'JsonWebTokenError: invalid token || No token provided || JWT does not contain required scope.',
        body: {},
    }),
    (0, tsoa_1.Response)(404, 'notFound', {
        code: '404',
        message: 'error',
        body: {},
    }),
    (0, tsoa_1.SuccessResponse)('200', 'ok'),
    (0, tsoa_1.Example)({
        id: 2,
        email: 'jane@doe.com',
        name: 'Jane Doe',
        phoneNumbers: [],
    }),
    (0, tsoa_1.Get)('{userId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'hr', 'manger']),
    (0, tsoa_1.Delete)('{userId}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, tsoa_1.Post)('request-password-reset'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "requestPasswordReset", null);
__decorate([
    (0, tsoa_1.Post)('password-reset'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPasswordFromToken", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Patch)('{userId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "editUser", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'hr', 'manger']),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'hr', 'manger']),
    (0, tsoa_1.SuccessResponse)('201', 'Created'),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, tsoa_1.Response)(500, 'internal server error', {
        code: '500',
        message: 'internal server error',
        body: {},
    }),
    (0, tsoa_1.SuccessResponse)('201', 'Created'),
    (0, tsoa_1.Example)({
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InVzZXIiLCJ1c2VySWQiOiIxMiIsInJvbGUiOlsiYWRtaW4iXSwiaWF0IjoxNjE5NjI3MjEzLCJleHAiOjE2MTk3MTM2MTMsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCIsImlzcyI6InBlcmZvcm1hbmMiLCJzdWIiOiJ1c2VyIn0.CgeNJmI5ka6z5AxbOIDeQamIKRzEk7-sTUY3lJq20DSWUUisBv9QThhgKzFzjPc2CbXmKCpQboOibLmz8qxFfYT6fNHix67oc_C3VCPaHb9UnvFgd8OKjQTBMV2l1n7HKQgNxkNFAPjYu2e3TqrsM2iNfxH41bUo5f39rpr7ltU',
    }),
    (0, tsoa_1.Post)('login'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Get)('refresh-token/{userId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refreshToken", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Patch)('password-change/{userId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'hr']),
    (0, tsoa_1.Patch)('password-reset/{userId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
exports.UsersController = UsersController = __decorate([
    (0, tsoa_1.Route)('api/v1/users')
], UsersController);
//# sourceMappingURL=usersController.js.map