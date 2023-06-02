import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PerformanceCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  status: string;
}
