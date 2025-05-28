import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";

export class Expense {
    expense_id: number;
    user_id: number;
    category: string;
    amount: number;
    date: Date;
    description: string;
    created_at: Date;
    updated_at: Date;
}
