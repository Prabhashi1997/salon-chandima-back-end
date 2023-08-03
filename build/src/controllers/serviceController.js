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
exports.ServiceController = void 0;
const tsoa_1 = require("tsoa");
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const Response_1 = require("../Response");
const serviceService_1 = require("../service/serviceService");
let ServiceController = exports.ServiceController = class ServiceController extends ControllerBase_1.default {
    async getAll() {
        return this.exec(async () => {
            const response = await new serviceService_1.ServiceService().getAll();
            return Response_1.Responses.ok(response.body);
        });
    }
    async getSerivices(page, size, search) {
        return this.exec(async () => {
            const response = await new serviceService_1.ServiceService().getServices(page, size, search);
            return Response_1.Responses.ok(response.body);
        });
    }
    async getSerivice(id) {
        return this.exec(async () => {
            const response = await new serviceService_1.ServiceService().get(id);
            return Response_1.Responses.ok(response);
        });
    }
    async addService(requestBody, request) {
        return this.exec(async () => {
            const response = await new serviceService_1.ServiceService().addService(requestBody);
            return Response_1.Responses.ok(response.body);
        });
    }
    async editService(id, requestBody, request) {
        return this.exec(async () => {
            const service = await new serviceService_1.ServiceService().editService(id, requestBody);
            return service.body;
        });
    }
    async deleteService(id, request) {
        return this.exec(async () => {
            var _a;
            const service = await new serviceService_1.ServiceService().deleteService(id);
            return (_a = service === null || service === void 0 ? void 0 : service.body) !== null && _a !== void 0 ? _a : service;
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getAll", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getSerivices", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Get)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getSerivice", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin']),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "addService", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Patch)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "editService", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'employee']),
    (0, tsoa_1.Delete)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "deleteService", null);
exports.ServiceController = ServiceController = __decorate([
    (0, tsoa_1.Route)('api/v1/service')
], ServiceController);
//# sourceMappingURL=serviceController.js.map