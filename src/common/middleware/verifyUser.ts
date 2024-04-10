import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/data-service/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user-dto';



// export class CustomRequest extends Request{
//   headers:any;
//   user:{
//     id?:number;
//     firstName:string;
//     lastName:string;
//   }
// }


@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {  
  constructor(
    private readonly userService:UserService,
    private readonly authService:AuthService,
  ){}
  async use(req:any, res: Response, next: NextFunction) {
   const token =  req.headers.authorization?.split(' ')[1];
   if(!token) return res.status(400).send({message:"token missing"})
    try {
        const decodeData = this.authService.verifyJwtToken(token)
        const {password, createdAt, updatedAt , ...user} = await this.userService.fetchById(decodeData.id);
        if(!user) return res.status(410).send({message:"User has removed"})
        req.user = user
      console.log("======="+user);
        next()
    } catch (error) {
        res.status(401).send({message:HttpStatus.UNAUTHORIZED})
    }
  }
}
