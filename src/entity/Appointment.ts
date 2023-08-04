import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  ManyToOne,
  JoinColumn,
  OneToMany, JoinTable, ManyToMany,
} from 'typeorm';
import {Service} from "./Service";
import {Customer} from "./Customer";
import {Employee} from "./Employee";
import {AppointmentHistory} from "./AppointmentHistory";
import {Payment} from "./Payment";

@Entity()
export class Appointment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  price: number;

  @Column()
  duration: number;

  @Column()
  status: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column({ default: false })
  deleted: boolean;

  // @Column({nullable:true, default: 0 })
  // discount?: number;



  @OneToMany(() => Payment, (payment) => payment.appointment)
  @JoinColumn()
  payments: Payment[];


  @OneToMany(() => AppointmentHistory, (appointmentHistory) => appointmentHistory.appointment)
  @JoinColumn()
  appointmentHistories: AppointmentHistory[];


  @ManyToMany(() => Service, (service) => service.appointments)
  @JoinTable()
  @JoinColumn()
  services: Service[];



  @ManyToOne(() => Customer, (customer) => customer.appointment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;

  @RelationId((appointment: Appointment) => appointment.customer)
  @Column()
  customerId: number;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;


}
