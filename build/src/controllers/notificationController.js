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
exports.NotificationController = void 0;
const tsoa_1 = require("tsoa");
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const notificationService_1 = require("../service/notificationService");
const Response_1 = require("../Response");
let NotificationController = exports.NotificationController = class NotificationController extends ControllerBase_1.default {
    async createNotification(requestBody, request) {
        return this.exec(async () => {
            const response = await new notificationService_1.NotificationService().createNotification(requestBody);
            return Response_1.Responses.ok(response.body);
        });
    }
    async getNotification(request, userId, page, size, date) {
        const response = await new notificationService_1.NotificationService().getNotification(+request.user.userId, page, size, date);
        return response.body;
    }
    async markAsRead(userId, requestBody, request) {
        return this.exec(async () => {
            const response = await new notificationService_1.NotificationService().markAsRead(+request.user.userId, requestBody.notificationId, requestBody.all);
            return Response_1.Responses.ok(response.body);
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin']),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createNotification", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotification", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Patch)('{userId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
exports.NotificationController = NotificationController = __decorate([
    (0, tsoa_1.Route)('api/v1/notification')
], NotificationController);
//# sourceMappingURL=notificationController.js.map