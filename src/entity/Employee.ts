import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    RelationId,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Column,
} from 'typeorm';
import {User} from "./User";
import {Appointment} from "./Appointment";
import {Payment} from "./Payment";
import {AppointmentHistory} from "./AppointmentHistory";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.admin)
    @JoinColumn()
    user: User;

    @RelationId((employee: Employee) => employee.user)
    userId: number;

    @Column({ nullable: true })
    designation?: string;

    @Column()
    gender: string;


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
    address: any;
    age: any;

}
