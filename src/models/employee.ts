import {UserCreationParams} from "./user";

export interface EmployeeData extends UserCreationParams{
    id?: number;
    designation?: string;
    gender: string;
    dob: Date;

}
