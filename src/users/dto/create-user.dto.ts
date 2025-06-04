import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
export enum Role {
    ADMIN = "admin",
    USER = "user"
}
export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsEnum(["USER", "ADMIN"], {
        message: 'Valid role required'
    })
    role: Role = Role.USER;
}
