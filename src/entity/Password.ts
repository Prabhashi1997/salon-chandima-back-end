import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Password {
  @Column()
  password: string;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.password, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
