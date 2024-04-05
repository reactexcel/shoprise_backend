import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user-dto";


export class UserResponseDto extends CreateUserDto{
    @ApiProperty()
    createdAt:Date;

    @ApiProperty()
    updatedAt:Date;
}