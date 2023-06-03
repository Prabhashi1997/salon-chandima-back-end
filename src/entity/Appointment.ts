import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity()
  export class Appointment {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    date: Date;

    @Column()
    status: string;

    @Column({ nullable: true })
    duration: number;

    @Column({ nullable: true })
    customer: number;

    @Column({ nullable: true })
    employee: number;

    @Column({ nullable: true })
    service: number;

    
    @Column({ default: false })
    deleted: boolean;

    @Column({ nullable: true })
    payment: number;

    @Column({ nullable: true })
    appointmentHistory: number;

    


  }
  