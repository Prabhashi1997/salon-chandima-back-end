import {UserCreationParams} from "./user";

export interface CustomerData extends UserCreationParams{
    id?: number;
    gender: string;
    age: number,
    address: string;

}

export interface CustomerMessageType {
    id?: number;
    name: string;
    email: string;
    subject: string;
    message: string;
}
