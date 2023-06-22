"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const app_1 = require("./app");
const Configs_1 = __importDefault(require("./common/Configs"));
Configs_1.default.load();
const port = process.env.PORT || 3001;
app_1.app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map