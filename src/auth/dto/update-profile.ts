import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    username: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    password: string;
}
