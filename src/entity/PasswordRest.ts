import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class PasswordRest {
  @Column({ type: 'bigint' })
  timestamp: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.password, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
