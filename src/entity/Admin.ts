import {
    Entity,
    PrimaryGeneratedColumn,
    Column,

  } from 'typeorm';
  
  @Entity()
  export class Admin {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    user: number;


  }
  