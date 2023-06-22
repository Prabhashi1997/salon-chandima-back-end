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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.CommonController = void 0;
const ControllerBase_1 = __importDefault(require("../common/ControllerBase"));
const tsoa_1 = require("tsoa");
const Response_1 = require("../Response");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const Configs_1 = __importDefault(require("../common/Configs"));
let CommonController = exports.CommonController = class CommonController extends ControllerBase_1.default {
    async uploadFile(request) {
        return this.exec(async () => {
            var _a, _b;
            await this.handleFile(request);
            const ext = (_a = request === null || request === void 0 ? void 0 : request.file) === null || _a === void 0 ? void 0 : _a.originalname.split('.').reverse()[0].toLowerCase();
            if ((request === null || request === void 0 ? void 0 : request.file.mimetype.match(/^image/)) && (ext === 'jpg' || ext === 'png')) {
                const uniqueId = Date.now();
                fs.mkdirSync(`${Configs_1.default.uploadPath}/${uniqueId}`, { recursive: true });
                fs.writeFileSync(`${Configs_1.default.uploadPath}/${uniqueId}/${(_b = request === null || request === void 0 ? void 0 : request.file) === null || _b === void 0 ? void 0 : _b.originalname}`, request.file.buffer, {});
                return Response_1.Responses.ok({ path: `/${uniqueId}/${request.file.originalname}` });
            }
            else {
                return Response_1.Responses.forbidden();
            }
        });
    }
    handleFile(request) {
        const multerSingle = (0, multer_1.default)().single('file');
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, async (error) => {
                if (error) {
                    reject(error);
                }
                resolve(undefined);
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('jwt', ['admin', 'user', 'hr', 'manger']),
    (0, tsoa_1.Post)('uploadFile'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "uploadFile", null);
exports.CommonController = CommonController = __decorate([
    (0, tsoa_1.Route)('api/v1/common')
], CommonController);
//# sourceMappingURL=commonController.js.map