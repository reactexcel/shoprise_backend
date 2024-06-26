// user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Vehicle } from './vehicle.entity';
import { RealEstate } from './realestate.entity';
import { Comment } from './comment.entity';
import { SellerRating } from './sellerRating.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  phone?: string;

  @Column({ default: null })
  location?: string;

  @Column({ default: null })
  zipcode?: string;

  @Column({ default: null })
  address?: string;

  @Column({ default: null })
  linkedin?: string;

  @Column({ default: null })
  facebook?: string;

  @Column({ default: null })
  twitter?: string;

  @Column({ default: null })
  instagram?: string;

  @Column({ default: null })
  rating?: string;

  @Column({ default: null })
  profilePhoto?: string;

  @Column({ default: null })
  coverPhoto?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Blog, (blog) => blog.user)
  blog?: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicle?: Vehicle[];

  @OneToMany(() => RealEstate, (realEstate) => realEstate.user)
  realEstate?: RealEstate[];

  @OneToMany(() => Order, (order) => order.buyer)
  order?: Order[];

  @OneToMany(() => SellerRating, (sellerRating) => sellerRating.seller)
  ratingRec: SellerRating;

  @OneToMany(() => SellerRating, (sellerRating) => sellerRating.buyer)
  ratingCont: SellerRating;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
