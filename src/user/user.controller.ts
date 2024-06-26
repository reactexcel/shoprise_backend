import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  UseInterceptors,
  Put,
  ValidationPipe,
  UsePipes,
  Req,
  Get,
  UploadedFile,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response, request } from 'express';
import { User } from '../data-service/entities/user.entity';
import { ExistenceCheckInterceptor } from '../common/interceptors/isUserExist';
import * as bcrypt from 'bcrypt';
import {
  PASSWORD_RESET,
  SIGNIN_SUCCESSFULLY,
  SIGNUP_SUCCESSFULLY,
} from '../common/constants/response';
import {
  E_PASSWORD_NOT_MATCHED,
  E_USER_NOT_FOUND,
} from 'src/common/constants/exception';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { IncomingSigninDto } from './dto/signin-incoming-dto';
import { UserResponseDto } from './dto/user-response-dto';
import { ResetPasswordIncomingDto } from './dto/reset-password-incoming-dto';
import { Multer } from 'multer';
import { mailSender } from 'src/common/helper/mailSender';
import { ChatService } from 'src/chat/chat.service';

@Controller('user')
@ApiTags('user')
export class userController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}

  @Post('signup')
  @UseInterceptors(ExistenceCheckInterceptor)
  @ApiResponse({
    status: 201,
    description: 'User signup',
    type: UserResponseDto,
  })
  async signup(@Body() user: User, @Res() response: Response) {
    try {
      const { password, ...restData } = await this.userService.createUser(user);
      response
        .status(201)
        .send({ success: true, message: SIGNUP_SUCCESSFULLY, data: restData });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('signin')
  @UseInterceptors(ExistenceCheckInterceptor)
  @ApiResponse({
    status: 200,
    description: 'User signin',
    type: UserResponseDto,
  })
  async signin(@Body() user: IncomingSigninDto, @Res() response: Response) {
    const { email, password } = user;
    try {
      const { password, ...user } = await this.userService.fetchOne(email);
      const accessToken = await this.authService.generateJwtToken({
        id: user.id,
        firstName: user.firstName,
        email,
      });
      response.status(200).send({
        success: true,
        message: SIGNIN_SUCCESSFULLY,
        data: user,
        accessToken,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('reset-password')
  @ApiResponse({
    status: 200,
    description: 'Reset password',
    type: PASSWORD_RESET,
  })
  async resetPassword(
    @Body() updateUserDto: ResetPasswordIncomingDto,
    @Res() response: Response,
  ) {
    const { email, password, confirmPassword } = updateUserDto;
    try {
      const isUserExist = await this.userService.fetchOne(email);
      if (!isUserExist)
        return response.status(404).send({ message: E_USER_NOT_FOUND });

      const isMatched = password === confirmPassword;
      if (!isMatched)
        return response.status(400).send({ message: E_PASSWORD_NOT_MATCHED });

      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await this.userService.resetPassword(
        isUserExist.id,
        hashedPassword,
      );
      response.status(200).send({ message: PASSWORD_RESET });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get')
  async fetchById(@Req() req: any, @Res() response: Response) {
    try {
      const userData = await this.userService.fetchById(req.user.id);

      response.status(200).send({
        success: true,
        message: 'user fetched successfully',
        data: userData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Put('update')
  async updateProfile(
    @Req() req: any,
    @Res() response: Response,
    @Body() user: User,
  ) {
    try {
      const userData = await this.userService.updateProfile(req.user.id, user);

      response.status(200).send({
        success: true,
        message: 'user updated successfully',
        data: userData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }

  @Put('update/profile_img')
  async updateProfilePhoto(
    @UploadedFile() file: Multer.File[],
    @Req() req: any,
    @Res() response: Response,
  ) {
    try {
      const userData = await this.userService.updateProfilePhoto(
        req.user.id,
        req.files[0].filename,
      );

      response.status(200).send({
        success: true,
        message: 'user updated successfully',
        data: userData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }

  @Put('update/back_img')
  async updateCoverPhoto(@Req() req: any, @Res() response: Response) {
    try {
      const userData = await this.userService.updateCoverPhoto(
        req.user.id,
        req.files[0].filename,
      );

      response.status(200).send({
        success: true,
        message: 'user updated successfully',
        data: userData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }

  @Post('rating/:id')
  async addRating(
    @Param() param: { id: string },
    @Req() req: any,
    @Res() response: Response,
  ) {
    const { rating } = req.body;
    try {
      const userData = await this.userService.createRating(+param.id, {
        rating,
      });
      response
        .status(200)
        .send({ success: true, message: 'rating added successfully' });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }

  @Post('send-message')
  async sendMessage(@Req() request: any, @Res() response: Response) {
    const { message, email } = request.body;
    try {
      await mailSender(request.user.email, email, message);
      response.status(200).send({
        success: true,
        message: `Message send to ${request.user.firstName}`,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('chat/all-receiver-names')
  async getAllReceiver(@Req() req: any, @Res() response: Response) {
    try {
      const userData = await this.userService.fetchById(req.user.id);

      const receiverNames = await this.userService.fetchAllReceiver(
        userData.id,
      );
      response.status(200).send({
        success: true,
        message: 'user receiver list fetched successfully',
        receiver: receiverNames,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Get('chat/:receiverId')
  async fetchMessage(
    @Req() req: any,
    @Res() response: Response,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ) {
    try {
      const senderData = await this.userService.fetchById(req.user.id);
      const reciverData = await this.userService.fetchById(receiverId);

      const messages = await this.chatService.getMessages(
        senderData.id,
        receiverId,
      );
      response.status(200).send({
        success: true,
        message: 'user message fetched successfully',
        senderData: senderData,
        reciverData: reciverData,
        messages: messages,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('follow/:userToFollowId')
  async followUser(
    @Req() req: any,
    @Res() response: Response,
    @Param('userToFollowId') userToFollowId: number,
  ) {
    try {
      const userId = req.user.id;
      await this.userService.followUser(userId, userToFollowId);
      const followUser = await this.userService.fetchById(userToFollowId);
      return response.status(200).send({
        success: true,
        message: 'user followed successfully',
        user: followUser,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('unfollow/:userToUnfollowId')
  async unfollowUser(
    @Req() req: any,
    @Res() response: Response,
    @Param('userToUnfollowId') userToUnfollowId: number,
  ) {
    try {
      const userId = req.user.id;
      await this.userService.unfollowUser(userId, userToUnfollowId);
      const unFollowUser = await this.userService.fetchById(userToUnfollowId);

      return response.status(200).send({
        success: true,
        message: 'user un-followed successfully',
        user: unFollowUser,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('followers')
  async getAllFollowers(@Req() req: any): Promise<any> {
    try {
      const userId = req.user.id;
      const followers = await this.userService.getAllFollowers(userId);
      return { followers };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('following')
  async getAllFollowing(@Req() req: any): Promise<any> {
    try {
      const userId = req.user.id;
      const following = await this.userService.getAllFollowing(userId);
      return { following };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('product-listing/:userId')
  async fetchListingProducts(
    @Req() req: any,
    @Res() response: Response,
    @Param('userId') userId: number,
  ) {
    try {
      // const user = await this.userService.fetchById(userId);
      const products = await this.userService.getProductsListing(
        userId.toString(),
      );

      response.status(200).send({
        success: true,
        message: 'user product listing fetched successfully',
        items: products,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
