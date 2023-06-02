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

    @Column({ nullable: true })
    time: string;

  }
  