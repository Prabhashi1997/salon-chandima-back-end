import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Common {
  @PrimaryColumn()
  key: string;

  @Column()
  val: string;
}
