import {UserCreationParams} from "./user";

export interface CustomerData extends UserCreationParams{
    id?: number;
    gender: string;
    age: number,
    address: string;

}
