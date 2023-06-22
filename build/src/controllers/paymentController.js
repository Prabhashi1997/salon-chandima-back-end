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
exports.PaymentController = void 0;
const tsoa_1 = require("tsoa");
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const Response_1 = require("../Response");
const paymentService_1 = require("../service/paymentService");
let PaymentController = exports.PaymentController = class PaymentController extends ControllerBase_1.default {
    async getAll() {
        return this.exec(async () => {
            const response = await new paymentService_1.PaymentService().getAll();
            return Response_1.Responses.ok(response.body);
        });
    }
    async getPayment(page, size, search) {
        return this.exec(async () => {
            const response = await new paymentService_1.PaymentService().getPayment(page, size, search);
            return Response_1.Responses.ok(response.body);
        });
    }
    async addPayment(requestBody, request) {
        return this.exec(async () => {
            const response = await new paymentService_1.PaymentService().addPayment(requestBody);
            return Response_1.Responses.ok(response.body);
        });
    }
    async editPayment(id, requestBody, request) {
        return this.exec(async () => {
            const designation = await new paymentService_1.PaymentService().editPayment(id, requestBody);
            return designation.body;
        });
    }
    async deletePayment(id, request) {
        return this.exec(async () => {
            var _a;
            const designation = await new paymentService_1.PaymentService().deletePayment(id);
            return (_a = designation === null || designation === void 0 ? void 0 : designation.body) !== null && _a !== void 0 ? _a : designation;
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAll", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPayment", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "addPayment", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Patch)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "editPayment", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Delete)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "deletePayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, tsoa_1.Route)('api/v1/payment')
], PaymentController);
//# sourceMappingURL=paymentController.js.map