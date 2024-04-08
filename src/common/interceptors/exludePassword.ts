import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/data-service/entities/user.entity';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data =>{console.log(data)}),
    );
  }

  private excludePassword(data: User): Partial<User> {
    if (data && typeof data === 'object' && 'password' in data) {
      const { password, ...rest } = data;
      return rest;
    }
    return data;
  }
}
