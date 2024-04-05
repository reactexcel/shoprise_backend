import {IsEmail} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from 'src/data-service/entities/user.entity';
export class CreateUserDto{
    @ApiProperty({required:true, example:'john'})
    firstName:string;
    
    @ApiProperty({required:true, example:'doe'})
    lastName:string;

    @IsEmail()
    @ApiProperty({required:true, example:'john@gmail.com'})
    email:string;

    @ApiProperty({required:true, example:'john@12345'})
    password:string;


    @ApiProperty({required:true, example:'USER'})
    role:UserRole;

}