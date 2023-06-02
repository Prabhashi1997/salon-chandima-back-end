import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Name } from './Name';

@Entity()
export class User6 {
  @PrimaryGeneratedColumn()
  id: string;

  @Column(() => Name)
  name: Name;

  @Column()
  isActive: boolean;
}
