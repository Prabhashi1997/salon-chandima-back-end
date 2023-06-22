"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("@tsoa/runtime");
const Response_1 = require("../Response");
const Utils_1 = __importDefault(require("./Utils"));
class ControllerBase extends runtime_1.Controller {
    constructor() {
        super(...arguments);
        this.exec = (runner) => {
            const me = this;
            return new Promise((resolve, reject) => {
                runner()
                    .then((value) => {
                    me.setStatus(value.statusCode);
                    const body = value.body ? Utils_1.default.removeNull(value.body) : undefined;
                    resolve(body);
                })
                    .catch((err) => {
                    if (err instanceof Response_1.ServiceError) {
                        const e = err;
                        me.setStatus(e.code);
                        const errBody = { message: err.msg, body: err.body };
                        resolve(errBody);
                    }
                    else {
                        reject(err);
                    }
                });
            });
        };
    }
}
exports.default = ControllerBase;
//# sourceMappingURL=ControllerBase.js.map