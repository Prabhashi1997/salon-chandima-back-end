import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, OneToMany, OneToOne,
    PrimaryGeneratedColumn, RelationId, UpdateDateColumn,
} from 'typeorm';
import {User} from "./User";
import {Review} from "./Review";
import {Appointment} from "./Appointment";


@Entity()
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gender: string;

    @Column()
    age: number;

    @Column()
    address: string;


    @OneToOne(() => User, (user) => user.admin)
    @JoinColumn()
    user: User;

    @RelationId((customer: Customer) => customer.user)
    userId: number;

    @OneToMany(() => Review, (review) => review.customer)
    @JoinColumn()
    review: Review[];

    @OneToMany(() => Appointment, (appointment) => appointment.customer)
    @JoinColumn()
    appointment: Appointment[];


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

}
