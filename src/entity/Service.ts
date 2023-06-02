import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity()
  export class Service {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    serviceName: string;

    @Column({ nullable: true })
    price: number;

    @Column({ nullable: true })
    category: string; 
    
    @Column({ nullable: true})
    duration: string;

    @Column({ nullable: true})
    description: string;

  }
  

