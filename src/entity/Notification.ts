import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  time: Date;

  @Column()
  url: string;

  @Column()
  read: boolean;

  @RelationId((notifications: Notification) => notifications.user)
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.notifications, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
