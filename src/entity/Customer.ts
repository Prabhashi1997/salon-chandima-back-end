import {
    Entity,
    PrimaryGeneratedColumn,

  } from 'typeorm';

  
  @Entity()
  export class Customer {
  
    @PrimaryGeneratedColumn()
    id: number;

  }
  