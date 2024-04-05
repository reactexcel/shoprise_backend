import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable} from 'rxjs';
import * as bcrypt from 'bcrypt'
import { UserService } from '../../user/user.service';
import { E_INCORRECT_EMAIL_OR_PASSWORD, E_USER_EMAIL_TAKEN, E_USER_NOT_FOUND } from '../constants/exception';

@Injectable()
export class ExistenceCheckInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body; 

    const userExists = await this.userService.fetchOne(email);

    if (userExists) {
      if(request.url.includes('signin')) {
         const isValid = await bcrypt.compare(password, userExists.password);
         if(!isValid)
             throw new HttpException(E_INCORRECT_EMAIL_OR_PASSWORD , HttpStatus.NON_AUTHORITATIVE_INFORMATION)

         request.body.userData=userExists
         return next.handle();
      } else {
          throw new HttpException(E_USER_EMAIL_TAKEN, HttpStatus.BAD_REQUEST);
      }
    } else {
        if (request.url.includes('signup')){
          request.body.password = await bcrypt.hash(request.body.password, 10); 
          return next.handle();
        }
        else 
          throw new HttpException(E_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
   }
  }
}