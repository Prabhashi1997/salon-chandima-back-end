import {
    Entity,
    PrimaryGeneratedColumn,
    Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import {Employee} from "./Employee";
import {Appointment} from "./Appointment";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ nullable: true})
    description: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    card_expiry?: string;

    @Column({ nullable: true })
    card_holder_name?: string;

    @Column({ nullable: true })
    card_no?: string;

    @Column({ nullable: true })
    md5sig?: string;

    @Column({ nullable: true })
    merchant_id?: string;

    @Column({ nullable: true })
    method?: string;

    @Column({ nullable: true })
    order_id?: string;

    @Column({ nullable: true })
    payhere_amount?: string;

    @Column({ nullable: true })
    payhere_currency?: string;

    @Column({ nullable: true })
    payment_id?: string;

    @Column({ nullable: true })
    recurring?: string;

    @Column({ nullable: true })
    status_code?: string;

    @Column({ nullable: true })
    status_message?: string;

    @Column({ default: false })
    transaction: boolean;


    @ManyToOne(() => Appointment, (appointment) => appointment.payments, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    appointment: Appointment;

    @RelationId((payment: Payment) => payment.appointment)
    @Column()
    appointmentId: number;


    @ManyToOne(() => Employee, (employee) => employee.payments, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    employee: Employee;

    @RelationId((payment: Payment) => payment.employee)
    @Column()
    employeeId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;


}
