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
exports.AppointmentHistory = void 0;
const typeorm_1 = require("typeorm");
const Service_1 = require("./Service");
const Employee_1 = require("./Employee");
const Appointment_1 = require("./Appointment");
let AppointmentHistory = exports.AppointmentHistory = class AppointmentHistory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AppointmentHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AppointmentHistory.prototype, "dateAndTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppointmentHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AppointmentHistory.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Service_1.Service, (service) => service.appointmentHistories),
    (0, typeorm_1.JoinTable)(),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], AppointmentHistory.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Appointment_1.Appointment, (appointment) => appointment.appointmentHistories, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Appointment_1.Appointment)
], AppointmentHistory.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.RelationId)((appointmentHistory) => appointmentHistory.appointment),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AppointmentHistory.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.appointmentHistories, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], AppointmentHistory.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.RelationId)((appointment) => appointment.employee),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AppointmentHistory.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], AppointmentHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], AppointmentHistory.prototype, "updatedAt", void 0);
exports.AppointmentHistory = AppointmentHistory = __decorate([
    (0, typeorm_1.Entity)()
], AppointmentHistory);
//# sourceMappingURL=AppointmentHistory.js.map