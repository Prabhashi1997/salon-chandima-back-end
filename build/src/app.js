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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("../generated/routes");
const database_1 = require("./service/database");
const cors_1 = __importDefault(require("cors"));
const Configs_1 = __importDefault(require("./common/Configs"));
const fs = __importStar(require("fs"));
exports.app = (0, express_1.default)();
exports.app.use('/files', (req, res) => {
    const path = decodeURI(req.path);
    if (path.indexOf('../') === -1 && fs.existsSync(`${Configs_1.default.uploadPath}${path}`)) {
        res.download(`${Configs_1.default.uploadPath}${path}`);
    }
    else {
        res.status(404);
        res.end();
    }
});
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cors_1.default)({ origin: '*' }));
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({ origin: true }));
database_1.DatabaseService.getInstance().connect();
(0, routes_1.RegisterRoutes)(exports.app);
exports.app.use(function (req, res, next) {
    if (!('JSONResponse' in res)) {
        return next();
    }
    res.set('Cache-Control', 'private');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return next();
});
exports.app.use(function notFoundHandler(_req, res) {
    res.status(404).send({
        message: 'Not Found',
    });
});
//# sourceMappingURL=app.js.map