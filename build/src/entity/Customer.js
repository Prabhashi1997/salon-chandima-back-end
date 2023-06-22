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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Review_1 = require("./Review");
const Appointment_1 = require("./Appointment");
let Customer = exports.Customer = class Customer {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, (user) => user.admin),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], Customer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.RelationId)((customer) => customer.user),
    __metadata("design:type", Number)
], Customer.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, (review) => review.customer),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Customer.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.customer),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Customer.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)()
], Customer);
//# sourceMappingURL=Customer.js.map