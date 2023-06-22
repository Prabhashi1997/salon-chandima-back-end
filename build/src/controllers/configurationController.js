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
exports.ConfigurationController = void 0;
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const tsoa_1 = require("tsoa");
const Response_1 = require("../Response");
const configurationService_1 = require("../service/configurationService");
let ConfigurationController = exports.ConfigurationController = class ConfigurationController extends ControllerBase_1.default {
    async getConfig(page, size, search) {
        return this.exec(async () => {
            const response = await new configurationService_1.ConfigurationService().getConfig(page, size, search);
            return Response_1.Responses.ok(response.body);
        });
    }
    async addConfig(requestBody, request) {
        return this.exec(async () => {
            const response = await new configurationService_1.ConfigurationService().addConfig(requestBody);
            return Response_1.Responses.ok(response.body);
        });
    }
    async editConfig(id, requestBody, request) {
        return this.exec(async () => {
            const designation = await new configurationService_1.ConfigurationService().editConfig(id, requestBody);
            return designation.body;
        });
    }
    async deleteConfig(id, request) {
        return this.exec(async () => {
            const designation = await new configurationService_1.ConfigurationService().deleteConfig(id);
            return designation.body;
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin']),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getConfig", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin']),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "addConfig", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin']),
    (0, tsoa_1.Patch)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "editConfig", null);
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin']),
    (0, tsoa_1.Delete)('{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "deleteConfig", null);
exports.ConfigurationController = ConfigurationController = __decorate([
    (0, tsoa_1.Route)('api/v1/config')
], ConfigurationController);
//# sourceMappingURL=configurationController.js.map