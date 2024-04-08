import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, OneToMany, OneToMany } from "typeorm"
import * as bcrypt from 'bcrypt'
import { Blog } from "./blog.entity"
import { Product } from "./product.entity"


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

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn()
    createdAt?:Date;

    @UpdateDateColumn()
    updatedAt?:Date;


    @OneToMany(()=> Blog, (blog) => blog.user)
    blog?:Blog[]


    @OneToMany(() => Product, (product) => product.user)
    product?: Product[]
}