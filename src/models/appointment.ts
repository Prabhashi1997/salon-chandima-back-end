export interface AppointmentData {
    id?: number;
    dateAndTime: Date;
    status: string;
    duration?: number;
    deleted: boolean;
}
