import { NodeWorker } from "inspector/promises";

export class CreateExpenseDto {
    user_id: number;
    amount: number;
    category: string;
    date: Date;
    description: string;

}
