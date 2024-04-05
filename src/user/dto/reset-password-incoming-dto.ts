import { ApiProperty } from "@nestjs/swagger";


export class ResetPasswordIncomingDto{
    @ApiProperty({required:true, example:'john@gmail.com'})
    email:string;

    @ApiProperty({required:true, example:'password@123'})
    password:string;

    @ApiProperty({required:true, example:'password@123'})
    confirmPassword:string;
}