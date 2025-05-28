import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(["USER", "ADMIN"], {
        message: 'Valid role required'
    })
    role: 'USER' | 'ADMIN';
}
