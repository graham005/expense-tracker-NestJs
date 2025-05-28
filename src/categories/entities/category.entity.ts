import { Expense } from "src/expenses/entities/expense.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column()
    category_name: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @OneToMany(() => Expense, expense => expense.category)
    expenses: Expense[];
}
