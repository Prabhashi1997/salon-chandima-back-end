"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const database_1 = require("./database");
const Response_1 = require("../Response");
const Employee_1 = require("../entity/Employee");
class EmployeeService {
    async getAll() {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .createQueryBuilder('employee');
        const [employees, total] = await qb
            .orderBy('employee.name')
            .getManyAndCount();
        return Response_1.Responses.ok({
            employees: employees.map((item) => {
                return {
                    designation: item.designation,
                    gender: item.gender,
                    dob: item.dob,
                };
            }),
            total,
        });
    }
    async getEmployee(page, size, search) {
        const qb = database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .createQueryBuilder('employee');
        if (search) {
            qb.andWhere('lower(employee.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        const [employees, total] = await qb
            .orderBy('employee.name')
            .take(size !== null && size !== void 0 ? size : 10)
            .skip(page ? (page - 1) * (size !== null && size !== void 0 ? size : 10) : 0)
            .getManyAndCount();
        return Response_1.Responses.ok({
            employees: employees.map((item) => {
                return Object.assign({}, item);
            }),
            total,
        });
    }
    async addEmployee(requestBody) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newEmployee = new Employee_1.Employee();
            newEmployee.designation = requestBody.designation;
            newEmployee.gender = requestBody.gender;
            newEmployee.dob = requestBody.dob;
            await queryRunner.manager.save(newEmployee);
            requestBody.id = newEmployee.id;
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(requestBody);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteEmployee(id) {
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Employee_1.Employee, { id: id });
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(id);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async editEmployee(id, data) {
        const employee = await database_1.DatabaseService.getInstance()
            .getRepository(Employee_1.Employee)
            .findOne({ where: { id: id } });
        const queryRunner = database_1.DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            employee.designation = data.designation;
            employee.gender = data.gender;
            employee.dob = data.dob;
            await queryRunner.manager.save(employee);
            await queryRunner.commitTransaction();
            return Response_1.Responses.ok(employee);
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employeeService.js.map