import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../data-service/entities/user.entity';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService{
  constructor(
    // @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    // private readonly secretKey: string = process.env.SECRET_KEY,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    @Inject('SECRET_KEY') private readonly secretKey: string
  ) {}

  verifyJwtToken(token:string): any {
    return jwt.verify(token, this.secretKey);
  }

  generateJwtToken(jwtPayload:any): string {
    try {
        return jwt.sign(jwtPayload, this.secretKey)
    } catch (error) {
        throw new Error('Invalid token')
    }
  }

  async validateJwtPayload(field:string) {
    
  }
}