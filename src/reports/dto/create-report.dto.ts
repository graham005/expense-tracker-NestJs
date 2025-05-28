import { IsDateString, IsInt } from "class-validator";

export class CreateReportDto {
    @IsInt()
    user_id: number;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;
}
