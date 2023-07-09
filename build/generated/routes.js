"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
const runtime_1 = require("@tsoa/runtime");
const adminController_1 = require("./../src/controllers/adminController");
const appointmentController_1 = require("./../src/controllers/appointmentController");
const appointmentHistoryController_1 = require("./../src/controllers/appointmentHistoryController");
const commonController_1 = require("./../src/controllers/commonController");
const configurationController_1 = require("./../src/controllers/configurationController");
const customerController_1 = require("./../src/controllers/customerController");
const employeeController_1 = require("./../src/controllers/employeeController");
const notificationController_1 = require("./../src/controllers/notificationController");
const paymentController_1 = require("./../src/controllers/paymentController");
const reviewController_1 = require("./../src/controllers/reviewController");
const serviceController_1 = require("./../src/controllers/serviceController");
const usersController_1 = require("./../src/controllers/usersController");
const authentication_1 = require("./../src/authentication");
const promiseAny = require('promise.any');
const models = {
    "UserCreationParams": {
        "dataType": "refObject",
        "properties": {
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "epfNo": { "dataType": "double", "required": true },
            "designation": { "dataType": "any" },
            "email": { "dataType": "string", "required": true },
            "image": { "dataType": "string" },
            "doj": { "dataType": "string" },
            "roles": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    "AppointmentData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double" },
            "dateAndTime": { "dataType": "datetime", "required": true },
            "status": { "dataType": "string", "required": true },
            "duration": { "dataType": "double" },
            "deleted": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "ConfigData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double" },
            "key": { "dataType": "string", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "CustomerData": {
        "dataType": "refObject",
        "properties": {
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "epfNo": { "dataType": "double", "required": true },
            "designation": { "dataType": "any" },
            "email": { "dataType": "string", "required": true },
            "image": { "dataType": "string" },
            "doj": { "dataType": "string" },
            "roles": { "dataType": "array", "array": { "dataType": "string" } },
            "id": { "dataType": "double", "required": true },
            "gender": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "EmployeeData": {
        "dataType": "refObject",
        "properties": {
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "epfNo": { "dataType": "double", "required": true },
            "designation": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "image": { "dataType": "string" },
            "doj": { "dataType": "string" },
            "roles": { "dataType": "array", "array": { "dataType": "string" } },
            "id": { "dataType": "double" },
            "gender": { "dataType": "string", "required": true },
            "dob": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "NotificationData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double" },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "time": { "dataType": "datetime" },
            "url": { "dataType": "string", "required": true },
            "read": { "dataType": "boolean" },
            "user": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "PaymentData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "type": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "price": { "dataType": "double", "required": true },
            "card_expiry": { "dataType": "string" },
            "card_holder_name": { "dataType": "string" },
            "card_no": { "dataType": "string" },
            "merchant_id": { "dataType": "string" },
            "method": { "dataType": "string" },
            "order_id": { "dataType": "string" },
            "payhere_amount": { "dataType": "string" },
            "payhere_currency": { "dataType": "string" },
            "payment_id": { "dataType": "string" },
            "recurring": { "dataType": "string" },
            "status_code": { "dataType": "string" },
            "status_message": { "dataType": "string" },
            "transaction": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "ReviewData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double" },
            "comment": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "ServiceData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double" },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "image": { "dataType": "string" },
            "price": { "dataType": "double", "required": true },
            "duration": { "dataType": "double" },
            "category": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "Responses": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    "ErrorJson": {
        "dataType": "refObject",
        "properties": {
            "code": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
            "body": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "image": { "dataType": "string" },
            "doj": { "dataType": "string" },
            "roles": { "dataType": "array", "array": { "dataType": "string" } },
            "password": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Password" }, "required": true },
            "notifications": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Notification" }, "required": true },
            "admin": { "ref": "Admin" },
            "adminId": { "dataType": "double" },
            "employee": { "ref": "Employee" },
            "employeeId": { "dataType": "double" },
            "customer": { "ref": "Customer" },
            "customerId": { "dataType": "double" },
            "delete": { "dataType": "boolean", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Password": {
        "dataType": "refObject",
        "properties": {
            "password": { "dataType": "string", "required": true },
            "id": { "dataType": "double", "required": true },
            "user": { "ref": "User", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Notification": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "image": { "dataType": "string", "required": true },
            "time": { "dataType": "datetime", "required": true },
            "url": { "dataType": "string", "required": true },
            "read": { "dataType": "boolean", "required": true },
            "userId": { "dataType": "double", "required": true },
            "user": { "ref": "User", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Admin": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "user": { "ref": "User", "required": true },
            "userId": { "dataType": "double", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Appointment": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "dateAndTime": { "dataType": "datetime", "required": true },
            "status": { "dataType": "string", "required": true },
            "duration": { "dataType": "double", "required": true },
            "deleted": { "dataType": "boolean", "required": true },
            "payments": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Payment" }, "required": true },
            "appointmentHistories": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AppointmentHistory" }, "required": true },
            "services": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Service" }, "required": true },
            "customer": { "ref": "Customer", "required": true },
            "customerId": { "dataType": "double", "required": true },
            "employee": { "ref": "Employee", "required": true },
            "employeeId": { "dataType": "double", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Employee": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "user": { "ref": "User", "required": true },
            "userId": { "dataType": "double", "required": true },
            "designation": { "dataType": "string" },
            "gender": { "dataType": "string", "required": true },
            "dob": { "dataType": "datetime", "required": true },
            "appointment": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Appointment" }, "required": true },
            "appointmentHistories": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AppointmentHistory" }, "required": true },
            "payments": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Payment" }, "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Payment": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "type": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "price": { "dataType": "double", "required": true },
            "card_expiry": { "dataType": "string" },
            "card_holder_name": { "dataType": "string" },
            "card_no": { "dataType": "string" },
            "md5sig": { "dataType": "string" },
            "merchant_id": { "dataType": "string" },
            "method": { "dataType": "string" },
            "order_id": { "dataType": "string" },
            "payhere_amount": { "dataType": "string" },
            "payhere_currency": { "dataType": "string" },
            "payment_id": { "dataType": "string" },
            "recurring": { "dataType": "string" },
            "status_code": { "dataType": "string" },
            "status_message": { "dataType": "string" },
            "transaction": { "dataType": "boolean", "required": true },
            "appointment": { "ref": "Appointment", "required": true },
            "appointmentId": { "dataType": "double", "required": true },
            "employee": { "ref": "Employee", "required": true },
            "employeeId": { "dataType": "double", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "AppointmentHistory": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "dateAndTime": { "dataType": "datetime", "required": true },
            "status": { "dataType": "string", "required": true },
            "duration": { "dataType": "double", "required": true },
            "services": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Service" }, "required": true },
            "appointment": { "ref": "Appointment", "required": true },
            "appointmentId": { "dataType": "double", "required": true },
            "employee": { "ref": "Employee", "required": true },
            "employeeId": { "dataType": "double", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Service": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "image": { "dataType": "string" },
            "price": { "dataType": "double", "required": true },
            "category": { "dataType": "string" },
            "duration": { "dataType": "double" },
            "appointments": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Appointment" }, "required": true },
            "appointmentHistories": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AppointmentHistory" }, "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Customer": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "gender": { "dataType": "string", "required": true },
            "user": { "ref": "User", "required": true },
            "userId": { "dataType": "double", "required": true },
            "review": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Review" }, "required": true },
            "appointment": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Appointment" }, "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Review": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "comment": { "dataType": "string", "required": true },
            "customer": { "ref": "Customer", "required": true },
            "customerId": { "dataType": "double", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "DataTableResponse_User_": {
        "dataType": "refObject",
        "properties": {
            "total": { "dataType": "double", "required": true },
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "User" }, "required": true },
        },
        "additionalProperties": false,
    },
};
const validationService = new runtime_1.ValidationService(models);
function RegisterRoutes(app) {
    app.get('/api/v1/admin', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController.prototype.getAdmin)), function AdminController_getAdmin(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new adminController_1.AdminController();
            const promise = controller.getAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/admin', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController.prototype.addAdmin)), function AdminController_addAdmin(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserCreationParams" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new adminController_1.AdminController();
            const promise = controller.addAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/admin/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController.prototype.editAdmin)), function AdminController_editAdmin(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserCreationParams" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new adminController_1.AdminController();
            const promise = controller.editAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/admin/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(adminController_1.AdminController.prototype.deleteAdmin)), function AdminController_deleteAdmin(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new adminController_1.AdminController();
            const promise = controller.deleteAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/appointment/all', ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController)), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController.prototype.getAll)), function AppointmentController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentController_1.AppointmentController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/appointment', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController)), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController.prototype.getAppointment)), function AppointmentController_getAppointment(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentController_1.AppointmentController();
            const promise = controller.getAppointment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/appointment', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController)), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController.prototype.addAppointment)), function AppointmentController_addAppointment(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "AppointmentData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentController_1.AppointmentController();
            const promise = controller.addAppointment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/appointment/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController)), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController.prototype.editAppointment)), function AppointmentController_editAppointment(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "AppointmentData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentController_1.AppointmentController();
            const promise = controller.editAppointment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/appointment/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController)), ...((0, runtime_1.fetchMiddlewares)(appointmentController_1.AppointmentController.prototype.deleteAppointment)), function AppointmentController_deleteAppointment(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentController_1.AppointmentController();
            const promise = controller.deleteAppointment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/appointment-history/all', ...((0, runtime_1.fetchMiddlewares)(appointmentHistoryController_1.AppointmentHistoryController)), ...((0, runtime_1.fetchMiddlewares)(appointmentHistoryController_1.AppointmentHistoryController.prototype.getAll)), function AppointmentHistoryController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentHistoryController_1.AppointmentHistoryController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/appointment-history', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(appointmentHistoryController_1.AppointmentHistoryController)), ...((0, runtime_1.fetchMiddlewares)(appointmentHistoryController_1.AppointmentHistoryController.prototype.getAppointmentHistory)), function AppointmentHistoryController_getAppointmentHistory(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appointmentHistoryController_1.AppointmentHistoryController();
            const promise = controller.getAppointmentHistory.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/common/uploadFile', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(commonController_1.CommonController)), ...((0, runtime_1.fetchMiddlewares)(commonController_1.CommonController.prototype.uploadFile)), function CommonController_uploadFile(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new commonController_1.CommonController();
            const promise = controller.uploadFile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/config', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController)), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController.prototype.getConfig)), function ConfigurationController_getConfig(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new configurationController_1.ConfigurationController();
            const promise = controller.getConfig.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/config', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController)), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController.prototype.addConfig)), function ConfigurationController_addConfig(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ConfigData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new configurationController_1.ConfigurationController();
            const promise = controller.addConfig.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/config/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController)), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController.prototype.editConfig)), function ConfigurationController_editConfig(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ConfigData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new configurationController_1.ConfigurationController();
            const promise = controller.editConfig.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/config/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController)), ...((0, runtime_1.fetchMiddlewares)(configurationController_1.ConfigurationController.prototype.deleteConfig)), function ConfigurationController_deleteConfig(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new configurationController_1.ConfigurationController();
            const promise = controller.deleteConfig.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/customer/all', ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController)), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController.prototype.getAll)), function CustomerController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new customerController_1.CustomerController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/customer', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController)), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController.prototype.getCustomer)), function CustomerController_getCustomer(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new customerController_1.CustomerController();
            const promise = controller.getCustomer.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/customer', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController)), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController.prototype.addCustomer)), function CustomerController_addCustomer(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CustomerData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new customerController_1.CustomerController();
            const promise = controller.addCustomer.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/customer/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController)), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController.prototype.editCustomer)), function CustomerController_editCustomer(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CustomerData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new customerController_1.CustomerController();
            const promise = controller.editCustomer.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/customer/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController)), ...((0, runtime_1.fetchMiddlewares)(customerController_1.CustomerController.prototype.deleteCustomer)), function CustomerController_deleteCustomer(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new customerController_1.CustomerController();
            const promise = controller.deleteCustomer.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/employee/all', ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController)), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController.prototype.getAll)), function EmployeeController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new employeeController_1.EmployeeController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/employee', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController)), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController.prototype.getEmployee)), function EmployeeController_getEmployee(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new employeeController_1.EmployeeController();
            const promise = controller.getEmployee.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/employee', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController)), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController.prototype.addEmployee)), function EmployeeController_addEmployee(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "EmployeeData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new employeeController_1.EmployeeController();
            const promise = controller.addEmployee.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/employee/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController)), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController.prototype.editEmployee)), function EmployeeController_editEmployee(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "EmployeeData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new employeeController_1.EmployeeController();
            const promise = controller.editEmployee.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/employee/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController)), ...((0, runtime_1.fetchMiddlewares)(employeeController_1.EmployeeController.prototype.deleteEmployee)), function EmployeeController_deleteEmployee(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new employeeController_1.EmployeeController();
            const promise = controller.deleteEmployee.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/notification', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(notificationController_1.NotificationController)), ...((0, runtime_1.fetchMiddlewares)(notificationController_1.NotificationController.prototype.createNotification)), function NotificationController_createNotification(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "NotificationData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new notificationController_1.NotificationController();
            const promise = controller.createNotification.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/notification', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(notificationController_1.NotificationController)), ...((0, runtime_1.fetchMiddlewares)(notificationController_1.NotificationController.prototype.getNotification)), function NotificationController_getNotification(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            userId: { "in": "query", "name": "userId", "required": true, "dataType": "double" },
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            date: { "in": "query", "name": "date", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new notificationController_1.NotificationController();
            const promise = controller.getNotification.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/notification/:userId', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(notificationController_1.NotificationController)), ...((0, runtime_1.fetchMiddlewares)(notificationController_1.NotificationController.prototype.markAsRead)), function NotificationController_markAsRead(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "all": { "dataType": "boolean" }, "notificationId": { "dataType": "double", "required": true } } },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new notificationController_1.NotificationController();
            const promise = controller.markAsRead.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/payment/all', ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController)), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController.prototype.getAll)), function PaymentController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new paymentController_1.PaymentController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/payment', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController)), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController.prototype.getPayment)), function PaymentController_getPayment(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new paymentController_1.PaymentController();
            const promise = controller.getPayment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/payment', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController)), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController.prototype.addPayment)), function PaymentController_addPayment(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "PaymentData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new paymentController_1.PaymentController();
            const promise = controller.addPayment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/payment/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController)), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController.prototype.editPayment)), function PaymentController_editPayment(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "PaymentData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new paymentController_1.PaymentController();
            const promise = controller.editPayment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/payment/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController)), ...((0, runtime_1.fetchMiddlewares)(paymentController_1.PaymentController.prototype.deletePayment)), function PaymentController_deletePayment(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new paymentController_1.PaymentController();
            const promise = controller.deletePayment.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/reviw/all', ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController)), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController.prototype.getAll)), function ReviewController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new reviewController_1.ReviewController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/reviw', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController)), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController.prototype.getReview)), function ReviewController_getReview(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new reviewController_1.ReviewController();
            const promise = controller.getReview.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/reviw', authenticateMiddleware([{ "jwt": ["cutomer"] }]), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController)), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController.prototype.addReview)), function ReviewController_addReview(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ReviewData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new reviewController_1.ReviewController();
            const promise = controller.addReview.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/reviw/:id', authenticateMiddleware([{ "jwt": ["customer"] }]), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController)), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController.prototype.editReview)), function ReviewController_editReview(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ReviewData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new reviewController_1.ReviewController();
            const promise = controller.editReview.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/reviw/:id', authenticateMiddleware([{ "jwt": ["customer"] }]), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController)), ...((0, runtime_1.fetchMiddlewares)(reviewController_1.ReviewController.prototype.deleteReview)), function ReviewController_deleteReview(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new reviewController_1.ReviewController();
            const promise = controller.deleteReview.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/service/all', ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController)), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController.prototype.getAll)), function ServiceController_getAll(request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new serviceController_1.ServiceController();
            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/service', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController)), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController.prototype.getSerivices)), function ServiceController_getSerivices(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new serviceController_1.ServiceController();
            const promise = controller.getSerivices.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/service', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController)), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController.prototype.addService)), function ServiceController_addService(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ServiceData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new serviceController_1.ServiceController();
            const promise = controller.addService.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/service/:id', authenticateMiddleware([{ "jwt": ["admin", "employee"] }]), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController)), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController.prototype.editService)), function ServiceController_editService(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ServiceData" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new serviceController_1.ServiceController();
            const promise = controller.editService.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.delete('/api/v1/service/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController)), ...((0, runtime_1.fetchMiddlewares)(serviceController_1.ServiceController.prototype.deleteService)), function ServiceController_deleteService(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new serviceController_1.ServiceController();
            const promise = controller.deleteService.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/users/:userId', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.getUser)), function UsersController_getUser(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.getUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/users/request-password-reset', ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.requestPasswordReset)), function UsersController_requestPasswordReset(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true } } },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.requestPasswordReset.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/users/password-reset', ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.resetPasswordFromToken)), function UsersController_resetPasswordFromToken(request, response, next) {
        const args = {
            body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "token": { "dataType": "string", "required": true }, "password": { "dataType": "string", "required": true } } },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.resetPasswordFromToken.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/users/:userId', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.editUser)), function UsersController_editUser(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "double" },
            requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "user": { "ref": "UserCreationParams", "required": true } } },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.editUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/users', authenticateMiddleware([{ "jwt": ["admin", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.getUsers)), function UsersController_getUsers(request, response, next) {
        const args = {
            page: { "in": "query", "name": "page", "dataType": "double" },
            size: { "in": "query", "name": "size", "dataType": "double" },
            search: { "in": "query", "name": "search", "dataType": "string" },
            email: { "in": "query", "name": "email", "dataType": "string" },
            employeeId: { "in": "query", "name": "employeeId", "dataType": "string" },
            epfNumber: { "in": "query", "name": "epfNumber", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.getUsers.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.post('/api/v1/users/login', ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.login)), function UsersController_login(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "password": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true } } },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.login.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 201, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.get('/api/v1/users/refresh-token/:userId', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.refreshToken)), function UsersController_refreshToken(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "double" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.refreshToken.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/users/password-change/:userId', authenticateMiddleware([{ "jwt": ["admin", "user", "hr", "manger"] }]), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.changePassword)), function UsersController_changePassword(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "double" },
            value: { "in": "body", "name": "value", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "newPassword": { "dataType": "string", "required": true }, "currentPassword": { "dataType": "string", "required": true } } },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.changePassword.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    app.patch('/api/v1/users/password-reset/:userId', authenticateMiddleware([{ "jwt": ["admin", "hr"] }]), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController)), ...((0, runtime_1.fetchMiddlewares)(usersController_1.UsersController.prototype.resetPassword)), function UsersController_resetPassword(request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "double" },
            value: { "in": "body", "name": "value", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "newPassword": { "dataType": "string", "required": true } } },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new usersController_1.UsersController();
            const promise = controller.resetPassword.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(request, _response, next) {
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                            .catch(pushAndRethrow));
                    }
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                            .catch(pushAndRethrow));
                    }
                }
            }
            try {
                request['user'] = await promiseAny.call(Promise, secMethodOrPromises);
                next();
            }
            catch (err) {
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }
        };
    }
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200);
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
}
exports.RegisterRoutes = RegisterRoutes;
//# sourceMappingURL=routes.js.map