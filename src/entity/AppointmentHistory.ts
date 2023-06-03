import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity()
  export class AppointmentHistory {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    date: Date;
    
    @Column()
    status: string;

    @Column({ nullable: true })
    duration: number;

    @Column({ nullable: true })
    employee: number;

    @Column({ nullable: true })
    service: number;




  }
  