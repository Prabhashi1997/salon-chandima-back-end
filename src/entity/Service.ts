import {
  Entity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinColumn,
} from 'typeorm';
import {Appointment} from "./Appointment";
import {AppointmentHistory} from "./AppointmentHistory";

  @Entity()
  export class Service {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    image?: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    category?: string;

    @Column({ nullable: true})
    duration?: number;

    @ManyToMany(() => Appointment, (appointment) => appointment.services)
    @JoinColumn()
    appointments: Appointment[];


    @ManyToMany(() => AppointmentHistory, (appointmentHistory) => appointmentHistory.services)
    @JoinColumn()
    appointmentHistories: AppointmentHistory[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

  }


