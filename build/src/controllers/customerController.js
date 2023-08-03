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
exports.CustomerController = void 0;
const tsoa_1 = require("tsoa");
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const Response_1 = require("../Response");
const customerService_1 = require("../service/customerService");
let CustomerController = exports.CustomerController = class CustomerController extends ControllerBase_1.default {
    async getAll() {
        return this.exec(async () => {
            const response = await new customerService_1.CustomerService().getAll();
            return Response_1.Responses.ok(response.body);
        });
    }
    async getCustomers(page, size, search) {
        return this.exec(async () => {
            const response = await new customerService_1.CustomerService().getCustomer(page, size, search);
            return Response_1.Responses.ok(response.body);
        });
    }
    async getCustomerbyUserId(request) {
        return this.exec(async () => {
            const response = await new customerService_1.CustomerService().getCustomerbyUserId(+(request === null || request === void 0 ? void 0 : request.user.userId));
            return Response_1.Responses.ok(response);
        });
    }
    async getCustomer(id) {
        return this.exec(async () => {
            const response = await new customerService_1.CustomerService().get(id);
            return Response_1.Responses.ok(response);
        });
    }
    async addCustomer(requestBody, request) {
        return this.exec(async () => {
            const response = await new customerService_1.CustomerService().addCustomer(requestBody);
            return Response_1.Responses.ok(response);
        });
    }
    async editCustomer(id, requestBody, request) {
        return this.exec(async () => {
            var _a, _b, _c;
            const response = await new customerService_1.CustomerService().editCustomer(id, requestBody, +(request === null || request === void 0 ? void 0 : request.user.userId), (_b = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : []);
            return Response_1.Responses.ok((_c = response === null || response === void 0 ? void 0 : response.body) !== null && _c !== void 0 ? _c : response);
        });
    }
    async deleteCustomer(id, request) {
        return this.exec(async () => {
            var _a;
            const response = await new customerService_1.CustomerService().deleteCustomer(id);
            return Response_1.Responses.ok((_a = response === null || response === void 0 ? void 0 : response.body) !== null && _a !== void 0 ? _a : response);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAll", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomers", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['customer']),
    (0, tsoa_1.Get)('user'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerbyUserId", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Get)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomer", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addCustomer", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee', 'customer']),
    (0, tsoa_1.Patch)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "editCustomer", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Delete)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteCustomer", null);
exports.CustomerController = CustomerController = __decorate([
    (0, tsoa_1.Route)('api/v1/customer')
], CustomerController);
//# sourceMappingURL=customerController.js.map