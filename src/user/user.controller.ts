import { Controller, Post, Body, Res, HttpException, HttpStatus, UseInterceptors, Put, ValidationPipe, UsePipes, Req, Get, UploadedFile} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import {User} from '../data-service/entities/user.entity'
import { ExistenceCheckInterceptor } from '../common/interceptors/isUserExist';
import * as bcrypt from 'bcrypt'
import { PASSWORD_RESET, SIGNIN_SUCCESSFULLY, SIGNUP_SUCCESSFULLY } from '../common/constants/response';
import { E_PASSWORD_NOT_MATCHED, E_USER_NOT_FOUND } from 'src/common/constants/exception';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { IncomingSigninDto } from './dto/signin-incoming-dto';
import { UserResponseDto } from './dto/user-response-dto';
import { ResetPasswordIncomingDto } from './dto/reset-password-incoming-dto';
import {Multer} from 'multer'

@Controller('user')
@ApiTags('user')
export class userController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}


   @Post('signup')
   @UseInterceptors(ExistenceCheckInterceptor)
   @ApiResponse({ status: 201, description: 'User signup', type: UserResponseDto })
    async signup(@Body() user:CreateUserDto, @Res() response:Response) {
        try{
          const {password, ...restData} = await this.userService.createUser(user);
          response.status(201).send({success:true, message:SIGNUP_SUCCESSFULLY, data:restData})
        }catch(error){
          if(error instanceof HttpException) throw error;
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Post('signin')
    @UseInterceptors(ExistenceCheckInterceptor)
    @ApiResponse({ status: 200, description: 'User signin', type: UserResponseDto})
    async signin(@Body() user:IncomingSigninDto, @Res() response:Response){
        const {email, password} = user;
        try{
            const {password , ...user} = await this.userService.fetchOne(email)
            const accessToken =await this.authService.generateJwtToken({id:user.id, firstName:user.firstName ,email})
            response.status(200).send({success:true, message:SIGNIN_SUCCESSFULLY, data:user, accessToken})    
        }catch(error){
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('reset-password')
    @ApiResponse({ status: 200, description: 'Reset password', type:PASSWORD_RESET})
    async resetPassword(@Body() updateUserDto:ResetPasswordIncomingDto, @Res() response:Response){
        const {email , password, confirmPassword} = updateUserDto;
        try {
            const isUserExist = await this.userService.fetchOne(email);
            if(!isUserExist) return response.status(404).send({message:E_USER_NOT_FOUND})

            const isMatched = password === confirmPassword;
            if(!isMatched) return response.status(400).send({message:E_PASSWORD_NOT_MATCHED})

            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await this.userService.resetPassword(isUserExist.id, hashedPassword)
            response.status(200).send({message:PASSWORD_RESET})

        } catch (error) {
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('get')
    async fetchById(@Req() req:any, @Res() response:Response){
        try {
            
            const userData = await this.userService.fetchById(req.user.id)
            
            response.status(200).send({success:true, message:"user fetched successfully", data:userData})
        } catch (error) {
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }
    @Put('update')
    async updateProfile(@Req() req:any, @Res() response:Response, @Body() user:User){
        try {
            const userData = await this.userService.updateProfile(req.user.id,user)
            
            response.status(200).send({success:true, message:"user updated successfully", data:userData})
        } catch (error) {
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
        }
    }
    
    @Put('update/profile_img')
    async updateProfilePhoto(@UploadedFile() file:Multer.File[],@Req() req:any, @Res() response:Response){
        try {
            const userData = await this.userService.updateProfilePhoto(req.user.id,req.files[0].filename)
            
            response.status(200).send({success:true, message:"user updated successfully", data:userData})
        } catch (error) {
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
        }
    }
    
    @Put('update/back_img')
    async updateCoverPhoto(@Req() req:any, @Res() response:Response){
        try {
            const userData = await this.userService.updateCoverPhoto(req.user.id,req.files[0].filename)
            
            response.status(200).send({success:true, message:"user updated successfully", data:userData})
        } catch (error) {
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
        }
    }
}