import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../data-service/entities/user.entity';

@Injectable()
export class UserService{
  constructor(
    // @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userData:User): Promise<User> {
    const user =this.userRepository.create(userData);
    return this.userRepository.save(user)
  }

  async fetchAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async fetchOne(field:string): Promise<User> {
    return this.userRepository.findOne({where:{email:field}});
  }

  async fetchById(id:number): Promise<User> {
    return this.userRepository.findOne(
       {
          where:{id},
       });
  }

  async resetPassword(id:number , updatedPassword:string): Promise<User | null> {
    const user = await this.userRepository.findOne({where:{id}})
    const newUser =this.userRepository.merge(user, {password:updatedPassword})
    return await this.userRepository.save(newUser)
  }

  async updateProfile(id:number,user:User): Promise<User | any> {
    console.log(user," ========== ",id);
    // return this.userRepository.update(id,user)
    const q = 'UPDATE user SET (phone=?,location=?,zipcode=?,address=?,linkedin=?,facebook=?,twitter=?,instagram=?) WHERE id=?'
    return await this.userRepository.query(q,[user.phone,user.location,user.zipcode,user.address,user.linkedin,user.facebook,user.twitter,user.instagram,id])
    // return await this.userRepository
    //   .createQueryBuilder()
    //   .update(User)
    //   .set({
    //     phone:user.phone,
    //     location:user.location,
    //     zipcode:user.zipcode,
    //     address:user.address,
    //     linkedin:user.linkedin,
    //     facebook:user.facebook,
    //     twitter:user.twitter,
    //     instagram:user.instagram
    //   })
    //   .where("id = :id",{id})
    //   .execute()
  }

//   async updateProfileImg(id:number ,profileImgPath:string): Promise<Iassets> {
//     const assets = await this.assetsRepository.findOne({where:{id}});
//     if (assets.userProfile!=='' && fs.existsSync(`src/uploads/${assets.userProfile}`)) 
//        fs.unlinkSync(`src/uploads/${assets.userProfile}`);
//     const newAssets = this.assetsRepository.merge(assets, {userProfile:profileImgPath})
//     return await this.assetsRepository.save(newAssets)
//   }

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