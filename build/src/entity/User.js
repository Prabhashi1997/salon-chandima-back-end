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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Password_1 = require("./Password");
const Notification_1 = require("./Notification");
const Admin_1 = require("./Admin");
const Employee_1 = require("./Employee");
const Customer_1 = require("./Customer");
let User = exports.User = User_1 = class User {
};
User.Index = {
    Unique: {
        email: { idx: 'IDX_User_email', msg: 'An customer already exist with same email address' },
        nic: { idx: 'IDX_User_nic', msg: 'An customer already exist with same NIC number' },
    },
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(User_1.Index.Unique.email.idx, { unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(User_1.Index.Unique.nic.idx, { unique: true }),
    __metadata("design:type", String)
], User.prototype, "nic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "contactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "doj", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Password_1.Password, (password) => password.user),
    __metadata("design:type", Array)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification_1.Notification, (notification) => notification.user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Admin_1.Admin, { cascade: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Admin_1.Admin)
], User.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.RelationId)((user) => user.admin),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Employee_1.Employee, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], User.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.RelationId)((user) => user.employee),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Customer_1.Customer, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Customer_1.Customer)
], User.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.RelationId)((user) => user.customer),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Boolean)
], User.prototype, "delete", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = User_1 = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=User.js.map