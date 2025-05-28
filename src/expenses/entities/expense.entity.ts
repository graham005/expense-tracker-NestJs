import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    expense_id: number;

    @Column()
    amount: number;

    @Column('date')
    date: string;

    @Column({nullable: true})
    description: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Category, category => category.expenses) 
    category: Category;
}
