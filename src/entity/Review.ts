import {
    Entity,
    PrimaryGeneratedColumn,
    Column, RelationId, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import {Customer} from "./Customer";


@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column()
    rate: number;


    @ManyToOne(() => Customer, (customer) => customer.review, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    customer: Customer;

    @RelationId((review: Review) => review.customer)
    @Column()
    customerId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

}
