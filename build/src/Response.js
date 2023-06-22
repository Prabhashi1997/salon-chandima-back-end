"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Responses = exports.ServiceError = exports.ResponseCode = void 0;
class ResponseCode {
}
exports.ResponseCode = ResponseCode;
ResponseCode.continue = 100;
ResponseCode.switchingProtocols = 101;
ResponseCode.processing = 102;
ResponseCode.ok = 200;
ResponseCode.created = 201;
ResponseCode.accepted = 202;
ResponseCode.nonAuthoritativeInformation = 203;
ResponseCode.noContent = 204;
ResponseCode.resetContent = 205;
ResponseCode.partialContent = 206;
ResponseCode.multiStatus = 207;
ResponseCode.alreadyReported = 208;
ResponseCode.imUsed = 226;
ResponseCode.badRequest = 400;
ResponseCode.unauthorized = 401;
ResponseCode.paymentRequired = 402;
ResponseCode.forbidden = 403;
ResponseCode.notFound = 404;
ResponseCode.methodNotAllowed = 405;
ResponseCode.notAcceptable = 406;
ResponseCode.proxyAuthenticationRequired = 407;
ResponseCode.requestTimeout = 408;
ResponseCode.conflict = 409;
ResponseCode.gone = 410;
ResponseCode.lengthRequired = 411;
ResponseCode.preconditionFailed = 412;
ResponseCode.payloadTooLarge = 413;
ResponseCode.requestUriTooLong = 414;
ResponseCode.unsupportedMediaType = 415;
ResponseCode.requestedRangeNotSatisfiable = 416;
ResponseCode.expectationFailed = 417;
ResponseCode.iAmATeapot = 418;
ResponseCode.misdirectedRequest = 421;
ResponseCode.unprocessableEntity = 422;
ResponseCode.locked = 423;
ResponseCode.failedDependency = 424;
ResponseCode.upgradeRequired = 426;
ResponseCode.preconditionRequired = 428;
ResponseCode.tooManyRequests = 429;
ResponseCode.requestHeaderFieldsTooLarge = 431;
ResponseCode.connectionClosedWithoutResponse = 444;
ResponseCode.unavailableForLegalReasons = 451;
ResponseCode.clientClosedRequest = 499;
ResponseCode.internalServerError = 500;
ResponseCode.notImplemented = 501;
ResponseCode.badGateway = 502;
ResponseCode.serviceUnavailable = 503;
ResponseCode.gatewayTimeout = 504;
ResponseCode.httpVersionNotSupported = 505;
ResponseCode.variantAlsoNegotiates = 506;
ResponseCode.insufficientStorage = 507;
ResponseCode.loopDetected = 508;
ResponseCode.notExtended = 510;
ResponseCode.networkAuthenticationRequired = 511;
ResponseCode.networkConnectTimeoutError = 599;
class ServiceError extends Error {
    constructor(code, message, body, err) {
        super(`${code}: ${message}`);
        this.code = code;
        this.msg = message;
        this.body = body;
        this.err = err;
    }
}
exports.ServiceError = ServiceError;
class Responses {
}
exports.Responses = Responses;
Responses.defaultResponse = {};
Responses.continue = (body) => {
    return { statusCode: 100, body: body !== null && body !== void 0 ? body : Responses.defaultResponse };
};
Responses.switchingProtocols = (body) => {
    return { statusCode: 101, body: body !== null && body !== void 0 ? body : {} };
};
Responses.processing = (body) => {
    return { statusCode: 102, body: body !== null && body !== void 0 ? body : {} };
};
Responses.ok = (body) => {
    return { statusCode: 200, body: body !== null && body !== void 0 ? body : {} };
};
Responses.created = (body) => {
    return { statusCode: 201, body: body !== null && body !== void 0 ? body : {} };
};
Responses.accepted = (body) => {
    return { statusCode: 202, body: body !== null && body !== void 0 ? body : {} };
};
Responses.nonAuthoritativeInformation = (body) => {
    return { statusCode: 203, body: body !== null && body !== void 0 ? body : {} };
};
Responses.noContent = (body) => {
    return { statusCode: 204, body: body !== null && body !== void 0 ? body : {} };
};
Responses.resetContent = (body) => {
    return { statusCode: 205, body: body !== null && body !== void 0 ? body : {} };
};
Responses.partialContent = (body) => {
    return { statusCode: 206, body: body !== null && body !== void 0 ? body : {} };
};
Responses.multiStatus = (body) => {
    return { statusCode: 207, body: body !== null && body !== void 0 ? body : {} };
};
Responses.alreadyReported = (body) => {
    return { statusCode: 208, body: body !== null && body !== void 0 ? body : {} };
};
Responses.imUsed = (body) => {
    return { statusCode: 226, body: body !== null && body !== void 0 ? body : {} };
};
Responses.badRequest = (code, message, body) => {
    return { statusCode: 400, body: { code, message, body } };
};
Responses.unauthorized = (code, message, body) => {
    return { statusCode: 401, body: { code, message, body } };
};
Responses.paymentRequired = (code, message, body) => {
    return { statusCode: 402, body: { code, message, body } };
};
Responses.forbidden = (code, message, body) => {
    return { statusCode: 403, body: { code, message, body } };
};
Responses.notFound = (code, message, body) => {
    return { statusCode: 404, body: { code, message, body } };
};
Responses.methodNotAllowed = (code, message, body) => {
    return { statusCode: 405, body: { code, message, body } };
};
Responses.notAcceptable = (code, message, body) => {
    return { statusCode: 406, body: { code, message, body } };
};
Responses.proxyAuthenticationRequired = (code, message, body) => {
    return { statusCode: 407, body: { code, message, body } };
};
Responses.requestTimeout = (code, message, body) => {
    return { statusCode: 408, body: { code, message, body } };
};
Responses.conflict = (code, message, body) => {
    return { statusCode: 409, body: { code, message, body } };
};
Responses.gone = (code, message, body) => {
    return { statusCode: 410, body: { code, message, body } };
};
Responses.lengthRequired = (code, message, body) => {
    return { statusCode: 411, body: { code, message, body } };
};
Responses.preconditionFailed = (code, message, body) => {
    return { statusCode: 412, body: { code, message, body } };
};
Responses.payloadTooLarge = (code, message, body) => {
    return { statusCode: 413, body: { code, message, body } };
};
Responses.requestUriTooLong = (code, message, body) => {
    return { statusCode: 414, body: { code, message, body } };
};
Responses.unsupportedMediaType = (code, message, body) => {
    return { statusCode: 415, body: { code, message, body } };
};
Responses.requestedRangeNotSatisfiable = (code, message, body) => {
    return { statusCode: 416, body: { code, message, body } };
};
Responses.expectationFailed = (code, message, body) => {
    return { statusCode: 417, body: { code, message, body } };
};
Responses.iAmATeapot = (code, message, body) => {
    return { statusCode: 418, body: { code, message, body } };
};
Responses.misdirectedRequest = (code, message, body) => {
    return { statusCode: 421, body: { code, message, body } };
};
Responses.unprocessableEntity = (code, message, body) => {
    return { statusCode: 422, body: { code, message, body } };
};
Responses.locked = (code, message, body) => {
    return { statusCode: 423, body: { code, message, body } };
};
Responses.failedDependency = (code, message, body) => {
    return { statusCode: 424, body: { code, message, body } };
};
Responses.upgradeRequired = (code, message, body) => {
    return { statusCode: 426, body: { code, message, body } };
};
Responses.preconditionRequired = (code, message, body) => {
    return { statusCode: 428, body: { code, message, body } };
};
Responses.tooManyRequests = (code, message, body) => {
    return { statusCode: 429, body: { code, message, body } };
};
Responses.requestHeaderFieldsTooLarge = (code, message, body) => {
    return { statusCode: 431, body: { code, message, body } };
};
Responses.connectionClosedWithoutResponse = (code, message, body) => {
    return { statusCode: 444, body: { code, message, body } };
};
Responses.unavailableForLegalReasons = (code, message, body) => {
    return { statusCode: 451, body: { code, message, body } };
};
Responses.clientClosedRequest = (code, message, body) => {
    return { statusCode: 499, body: { code, message, body } };
};
Responses.internalServerError = (code, message, body) => {
    return { statusCode: 500, body: { code, message, body } };
};
Responses.notImplemented = (code, message, body) => {
    return { statusCode: 501, body: { code, message, body } };
};
Responses.badGateway = (code, message, body) => {
    return { statusCode: 502, body: { code, message, body } };
};
Responses.serviceUnavailable = (code, message, body) => {
    return { statusCode: 503, body: { code, message, body } };
};
Responses.gatewayTimeout = (code, message, body) => {
    return { statusCode: 504, body: { code, message, body } };
};
Responses.httpVersionNotSupported = (code, message, body) => {
    return { statusCode: 505, body: { code, message, body } };
};
Responses.variantAlsoNegotiates = (code, message, body) => {
    return { statusCode: 506, body: { code, message, body } };
};
Responses.insufficientStorage = (code, message, body) => {
    return { statusCode: 507, body: { code, message, body } };
};
Responses.loopDetected = (code, message, body) => {
    return { statusCode: 508, body: { code, message, body } };
};
Responses.notExtended = (code, message, body) => {
    return { statusCode: 510, body: { code, message, body } };
};
Responses.networkAuthenticationRequired = (code, message, body) => {
    return { statusCode: 511, body: { code, message, body } };
};
Responses.networkConnectTimeoutError = (code, message, body) => {
    return { statusCode: 599, body: { code, message, body } };
};
//# sourceMappingURL=Response.js.map