import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Type1 {
  // Primary Generated Column with uuid
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

@Entity()
export class Type2 {
  // Primary Generated Column
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

@Entity()
export class Type3 {
  // Primary Column
  @PrimaryColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

@Entity()
export class Type4 {
  // composite primary columns
  @PrimaryColumn()
  id: number;

  @PrimaryColumn()
  index: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

@Entity()
export class Type5 {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  // column with  type
  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  lastName: string;

  // Generated column
  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'int', width: 200 })
  number: number;

  @Column('simple-array')
  friends: string[];

  @CreateDateColumn()
  createDate: any;

  @UpdateDateColumn()
  updateDate: any;

  @DeleteDateColumn()
  DeleteDate: any;

  @VersionColumn()
  version: any;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role: UserRole;
}

export type UserRoleType = 'admin' | 'editor' | 'ghost';

@Entity()
export class Role1 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['admin', 'editor', 'ghost'],
    default: 'ghost',
  })
  role: UserRoleType;
}
