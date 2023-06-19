import {DatabaseService} from './database';
import {Responses} from '../Response';
import {Employee} from "../entity/Employee";
import { EmployeeData } from '../models/employee';

export class EmployeeService {
    public async getAll() {
        const qb = DatabaseService.getInstance()
            .getRepository(Employee)
            .createQueryBuilder('employee');

        const [employees, total] = await qb
            .orderBy('employee.name')
            .getManyAndCount();

        return Responses.ok({
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
    public async getEmployee(page?: number, size?: number, search?: string) {
        const qb = DatabaseService.getInstance()
            .getRepository(Employee)
            .createQueryBuilder('employee');
        if (search) {
            qb.andWhere('lower(employee.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        const [employees, total] = await qb
            .orderBy('employee.name')
            .take(size ?? 10)
            .skip(page ? (page - 1) * (size ?? 10) : 0)
            .getManyAndCount();

        return Responses.ok({
            employees: employees.map((item) => {
                return {...item};
            }),
            total,
        });
    }
    public async addEmployee(requestBody: EmployeeData): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newEmployee = new Employee();
            newEmployee.designation = requestBody.designation;
            newEmployee.gender = requestBody.gender;
            newEmployee.dob = requestBody.dob;
            await queryRunner.manager.save(newEmployee);

            requestBody.id = newEmployee.id;
            await queryRunner.commitTransaction();
            return Responses.ok(requestBody);
        } catch (e) {
            console.log(e);
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
    public async deleteEmployee(id: number): Promise<{ body: any; statusCode: number }> {
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(Employee, { id: id });
            await queryRunner.commitTransaction();
            return Responses.ok(id);
        } catch (e) {
            // since we have errors let's rollback changes we made
            console.log(e);
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
    public async editEmployee(id: number, data: EmployeeData): Promise<{ body: any; statusCode: number }> {
        const employee = await DatabaseService.getInstance()
            .getRepository(Employee)
            .findOne({ where: { id: id } });
        const queryRunner = DatabaseService.getInstance().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            employee.designation = data.designation;
            employee.gender = data.gender;
            employee.dob = data.dob;

            await queryRunner.manager.save(employee);
            await queryRunner.commitTransaction();
            return Responses.ok(employee);
        } catch (e) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
