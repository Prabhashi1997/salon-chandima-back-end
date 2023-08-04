import {
    Entity,
    PrimaryGeneratedColumn,
    Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import {Employee} from "./Employee";
import {Appointment} from "./Appointment";
import {Customer} from "./Customer";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    price: number;


    @ManyToOne(() => Appointment, (appointment) => appointment.payments, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    appointment: Appointment;

    @RelationId((payment: Payment) => payment.appointment)
    @Column()
    appointmentId: number;


    @ManyToOne(() => Customer, (customer) => customer.payments, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    customer: Customer;

    @RelationId((payment: Payment) => payment.customer)
    @Column()
    customerId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;


}
