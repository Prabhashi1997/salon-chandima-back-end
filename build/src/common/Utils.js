"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
}
Utils.getIndexErrorMessage = (def, idx) => {
    const d = Object.entries(def.Unique).find((value) => value[1].idx === idx);
    if (d) {
        return [{ name: d[0], errors: [d[1].msg] }];
    }
    return [{ name: 'unknown', errors: ['Unknown error'] }];
};
Utils.removeNull = (value) => {
    if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
            return value.map((v) => Utils.removeNull(v));
        }
        else if (typeof value === 'object') {
            return Object.fromEntries(Object.entries(value)
                .map((v) => [v[0], Utils.removeNull(v[1])])
                .filter((v) => v[1] !== null));
        }
    }
    return value;
};
Utils.selectFields = (value, ...fields) => {
    if (Array.isArray(value)) {
        return value.map((v) => Utils.selectFields(v, ...fields));
    }
    return Object.fromEntries(Object.entries(value).filter((f) => fields.indexOf(f[0]) !== -1));
};
exports.default = Utils;
//# sourceMappingURL=Utils.js.map