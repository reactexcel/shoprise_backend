import { ApiProperty } from "@nestjs/swagger";


export class IncomingSigninDto{
    @ApiProperty()
    email:string;


    @ApiProperty()
    password:string;
}