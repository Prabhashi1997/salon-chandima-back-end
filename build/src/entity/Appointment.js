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
exports.Appointment = void 0;
const typeorm_1 = require("typeorm");
const Service_1 = require("./Service");
const Customer_1 = require("./Customer");
const Employee_1 = require("./Employee");
const AppointmentHistory_1 = require("./AppointmentHistory");
const Payment_1 = require("./Payment");
let Appointment = exports.Appointment = class Appointment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Appointment.prototype, "dateAndTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Appointment.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.appointment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Appointment.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AppointmentHistory_1.AppointmentHistory, (appointmentHistory) => appointmentHistory.appointment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Appointment.prototype, "appointmentHistories", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Service_1.Service, (service) => service.appointments),
    (0, typeorm_1.JoinTable)(),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Appointment.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, (customer) => customer.appointment, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Customer_1.Customer)
], Appointment.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.RelationId)((appointment) => appointment.customer),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Appointment.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.appointment, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Appointment.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.RelationId)((appointment) => appointment.employee),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Appointment.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Appointment.prototype, "updatedAt", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)()
], Appointment);
//# sourceMappingURL=Appointment.js.map