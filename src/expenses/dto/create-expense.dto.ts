import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Matches } from "class-validator";


export class CreateExpenseDto {
    @IsInt()
    user_id: number;

    @IsNumber()
    amount: number;

    @IsInt()
    category_id: number;

    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
    date: string;

    @IsString()
    @IsOptional()
    description: string;

}
