export interface AppointmentData {
    id?: number;
    date: string;
    time: number;
    status?: string;
    duration?: number;
    deleted?: boolean;
    start: string;
    end: string;
    price: number;
    customer?: any;
    service?: any[];
}
