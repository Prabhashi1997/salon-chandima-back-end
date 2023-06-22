"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
class Configs {
    static load() {
        var _a;
        dotenv_1.default.config();
        Configs.uploadPath = (_a = process.env.UPLOAD_PATH) !== null && _a !== void 0 ? _a : `${__dirname}/../../upload`;
    }
}
Configs.uploadPath = '.';
exports.default = Configs;
//# sourceMappingURL=Configs.js.map