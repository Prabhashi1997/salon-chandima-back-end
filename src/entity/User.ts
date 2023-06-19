import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  Index,
  OneToMany, OneToOne, RelationId, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Password } from './Password';
import { Notification } from './Notification';
import {Admin} from "./Admin";
import {Employee} from "./Employee";
import {Customer} from "./Customer";

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


  @OneToOne(() => Admin, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  admin?: Admin;

  @RelationId((user: User) => user.admin)
  @Column({ nullable: true })
  adminId?: number;

  @OneToOne(() => Employee, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  employee?: Employee;

  @RelationId((user: User) => user.employee)
  @Column({ nullable: true })
  employeeId?: number;

  @OneToOne(() => Customer, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  customer?: Customer;

  @RelationId((user: User) => user.customer)
  @Column({ nullable: true })
  customerId?: number;

  @Column({ default: false })
  @JoinColumn()
  delete: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
