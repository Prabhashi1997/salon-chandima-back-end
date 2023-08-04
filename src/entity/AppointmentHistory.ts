import {
  Entity,
  PrimaryGeneratedColumn,
  Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable,
} from 'typeorm';
import {Service} from "./Service";
import {Employee} from "./Employee";
import {Appointment} from "./Appointment";

@Entity()
export class AppointmentHistory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  dateAndTime: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  duration: number;



  @ManyToMany(() => Service, (service) => service.appointmentHistories)
  @JoinTable()
  @JoinColumn()
  services: Service[];


  @ManyToOne(() => Appointment, (appointment) => appointment.appointmentHistories, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  appointment: Appointment;

  @RelationId((appointmentHistory: AppointmentHistory) => appointmentHistory.appointment)
  @Column()
  appointmentId: number;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
