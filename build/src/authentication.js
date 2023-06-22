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
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const Common_1 = require("./entity/Common");
const database_1 = require("./service/database");
const expressAuthentication = (request, securityName, scopes) => {
    if (securityName === 'jwt') {
        return new Promise(async (resolve, reject) => {
            var _a;
            if (request.headers['authorization'] === '' || request.headers['authorization'] === undefined) {
                reject(new ReferenceError('No token provided'));
            }
            const token = (_a = request.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
            if (!token) {
                reject(new ReferenceError('No token provided'));
            }
            const verifyOptions = {
                issuer: 'StridePal',
                subject: 'user',
                audience: 'http://localhost:4000',
                maxAge: '58365h',
                algorithms: ['RS256'],
            };
            const key = await database_1.DatabaseService.getInstance()
                .getRepository(Common_1.Common)
                .findOne({ where: { key: 'publicKey' } });
            jwt.verify(token, key.val, verifyOptions, (err, decoded) => {
                if (err) {
                    reject(new ReferenceError(err));
                }
                else {
                    if (decoded.role.filter((e) => scopes.indexOf(e) !== -1).length === 0) {
                        reject(new ReferenceError('JWT does not contain required scope.'));
                    }
                    resolve(decoded);
                }
            });
        });
    }
};
exports.expressAuthentication = expressAuthentication;
//# sourceMappingURL=authentication.js.map