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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Appointment_1 = require("./Appointment");
const Payment_1 = require("./Payment");
const AppointmentHistory_1 = require("./AppointmentHistory");
let Employee = exports.Employee = class Employee {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, (user) => user.admin),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], Employee.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.RelationId)((employee) => employee.user),
    __metadata("design:type", Number)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.employee),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Employee.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AppointmentHistory_1.AppointmentHistory, (appointmentHistory) => appointmentHistory.employee),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Employee.prototype, "appointmentHistories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.employee),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Employee.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)()
], Employee);
//# sourceMappingURL=Employee.js.map