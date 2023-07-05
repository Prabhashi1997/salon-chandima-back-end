import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  JoinColumn, OneToOne
} from 'typeorm';
import {User} from "./User";

@Entity()
export class Admin {
  static map(arg0: (item: any) => { name: any; }) {
      throw new Error('Method not implemented.');
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn()
  user: User;

  @RelationId((admin: Admin) => admin.user)
  userId: number;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;


}
