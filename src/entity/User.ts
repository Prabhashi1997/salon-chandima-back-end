import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Password } from './Password';
import { Notification } from './Notification';

@Entity()
export class User {
  static Index = {
    Unique: {
      email: { idx: 'IDX_User_email', msg: 'An employee already exist with same email address' },
    },
  };
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  @Index(User.Index.Unique.email.idx, { unique: true })
  email: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  doj?: string;

  @Column({ type: 'simple-array', default: 'admin,user', nullable: true })
  roles?: string[];

  @OneToMany(() => Password, (password) => password.user)
  password: Password[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @JoinColumn()
  notifications: Notification[];

  @Column({ default: false })
  @JoinColumn()
  delete: boolean;
}
