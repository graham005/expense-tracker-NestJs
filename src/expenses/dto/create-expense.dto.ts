import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Matches } from "class-validator";


export class CreateExpenseDto {
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsInt()
    category_id: number;

    @ApiProperty()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
    date: string;

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    description: string;

}
