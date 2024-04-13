import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from "typeorm"
import * as bcrypt from 'bcrypt'
import { Blog } from "./blog.entity"
import { Product } from "./product.entity"
import { Order } from "./order.entity"


 export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string
    
    @Column({default:null})
    phone?: string
    
    @Column({default:null})
    location?: string
    
    @Column({default:null})
    zipcode?: string
    
    @Column({default:null})
    address?: string
    
    @Column({default:null})
    linkedin?: string
    
    @Column({default:null})
    facebook?: string
    
    @Column({default:null})
    twitter?: string
    
    @Column({default:null})
    instagram?: string
    
    @Column({default:null})
    rating?: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn()
    createdAt?:Date;

    @UpdateDateColumn()
    updatedAt?:Date;


    @OneToMany(()=> Blog, (blog) => blog.user)
    blog?:Blog[]


    @OneToMany(() => Product, (product) => product.user)
    products?: Product[]
    
    @OneToMany(() => Order, (order) => order.user)
    order?: Order[]
}