import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../data-service/entities/user.entity';
import { SellerRating } from 'src/data-service/entities/sellerRating.entity';
import { Message } from 'src/data-service/entities/message.entity';
import { Product } from 'src/data-service/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class UserService {
  constructor(
    // @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(SellerRating)
    private readonly sellerRatingRepository: Repository<SellerRating>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private orderService: OrderService,
  ) {}

  async createUser(userData: User): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async fetchAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async fetchOne(field: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email: field },
      relations: { ratingRec: true },
    });
  }

  async fetchById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async resetPassword(
    id: number,
    updatedPassword: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    const newUser = this.userRepository.merge(user, {
      password: updatedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async updateProfile(id: number, user: User): Promise<User | any> {
    await this.userRepository.update(id, user);
    return this.fetchById(id);
  }

  async updateProfilePhoto(id: number, path: string): Promise<User | null> {
    await this.userRepository.update(id, {
      profilePhoto: 'http://116.202.210.102:3000/uploads/' + path,
    });
    return this.fetchById(id);
  }

  async updateCoverPhoto(id: number, path: string): Promise<User | null> {
    await this.userRepository.update(id, {
      coverPhoto: 'http://116.202.210.102:3000/uploads/' + path,
    });
    return this.fetchById(id);
  }

  async createRating(
    id: number,
    data: Partial<SellerRating>,
  ): Promise<SellerRating> {
    const rating = await this.sellerRatingRepository.findOne({ where: { id } });
    if (rating) {
      return await this.sellerRatingRepository.save(
        this.sellerRatingRepository.merge(rating, data),
      );
    }
    return this.sellerRatingRepository.save(
      this.sellerRatingRepository.create(data),
    );
  }

  async fetchAllReceiver(id: number): Promise<any> {
    const subQuery = this.messageRepository
      .createQueryBuilder('subquery')
      .select('MAX(subquery.createdAt)', 'maxCreatedAt')
      .addSelect('subquery.recipientId', 'recipientId')
      .addSelect('MAX(subquery.createdAt)', 'lastMessageTime')
      .where('subquery.senderId = :id', { id })
      .groupBy('subquery.recipientId')
      .getQuery();

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .select(['message.recipientId', 'message.message'])
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.lastName', 'lastName')
      .addSelect('user.profilePhoto', 'profilePhoto')
      .addSelect('sub.lastMessageTime')
      .innerJoin(
        `(${subQuery})`,
        'sub',
        'sub.recipientId = message.recipientId AND sub.maxCreatedAt = message.createdAt',
      )
      .innerJoin('User', 'user', 'user.id = message.recipientId')
      .where('message.senderId = :id', { id })
      .getRawMany();

    return messages;
  }

  async followUser(
    loggedInUserId: number,
    userToFollowId: number,
  ): Promise<void> {
    const userToFollow = await this.userRepository.findOne({
      where: { id: userToFollowId },
    });
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }

    let loggedInUser = await this.userRepository.findOne({
      where: { id: loggedInUserId },
      relations: ['following'],
    });
    if (!loggedInUser) {
      throw new NotFoundException('Logged-in user not found');
    }
    loggedInUser.following.push(userToFollow);
    await this.userRepository.save(loggedInUser);

    let userToFollowWithFollowers = await this.userRepository.findOne({
      where: { id: userToFollowId },
      relations: ['followers'],
    });
    if (!userToFollowWithFollowers) {
      throw new NotFoundException('User to follow not found');
    }
    userToFollowWithFollowers.followers.push({ id: loggedInUserId } as User);
    await this.userRepository.save(userToFollowWithFollowers);
  }

  async unfollowUser(
    loggedInUserId: number,
    userToUnfollowId: number,
  ): Promise<void> {
    const userToUnfollow = await this.userRepository.findOne({
      where: { id: userToUnfollowId },
    });
    if (!userToUnfollow) {
      throw new NotFoundException('User to unfollow not found');
    }

    let loggedInUser = await this.userRepository.findOne({
      where: { id: loggedInUserId },
      relations: ['following'],
    });
    if (!loggedInUser) {
      throw new NotFoundException('Logged-in user not found');
    }
    loggedInUser.following = loggedInUser.following.filter(
      (user) => user.id !== userToUnfollow.id,
    );
    await this.userRepository.save(loggedInUser);

    let userToUnfollowWithFollowers = await this.userRepository.findOne({
      where: { id: userToUnfollowId },
      relations: ['followers'],
    });
    if (!userToUnfollowWithFollowers) {
      throw new NotFoundException('User to unfollow not found');
    }
    userToUnfollowWithFollowers.followers =
      userToUnfollowWithFollowers.followers.filter(
        (user) => user.id !== loggedInUserId,
      );
    await this.userRepository.save(userToUnfollowWithFollowers);
  }

  async getAllFollowers(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.followers;
  }

  async getAllFollowing(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.following;
  }

  async getProductsListing(id: string): Promise<any> {
    return await this.orderService.getListing(id);
  }

  // async updateProfileImg(id:number ,profileImgPath:string): Promise<Iassets> {
  //   const assets = await this.assetsRepository.findOne({where:{id}});
  //   if (assets.userProfile!=='' && fs.existsSync(`src/uploads/${assets.userProfile}`))
  //      fs.unlinkSync(`src/uploads/${assets.userProfile}`);
  //   const newAssets = this.assetsRepository.merge(assets, {userProfile:profileImgPath})
  //   return await this.assetsRepository.save(newAssets)
  // }

  //   async updateBkgdImg(id:number ,backgroundImgPath:string): Promise<UserAssets> {
  //     const assets = await this.assetsRepository.findOne({where:{id}});
  //     if (assets.userBackground!=='' && fs.existsSync(`src/uploads/${assets.userBackground}`))
  //        fs.unlinkSync(`src/uploads/${assets.userBackground}`);
  //     const newAssets = this.assetsRepository.merge(assets, {userBackground:backgroundImgPath})
  //     return await this.assetsRepository.save(newAssets)
  //   }

  //   async createActivity(activity:createActivityI): Promise<fetchActivityI> {
  //     const newActivity = this.activityRepository.create(activity);
  //     return await this.activityRepository.save(newActivity)
  //   }

  //   async updateActivity(id:number): Promise<fetchActivityI> {
  //     const activity = await this.activityRepository.findOne({where:{id}});
  //     activity.isAccepted = true;
  //     return await this.activityRepository.save(activity)
  //   }
}
