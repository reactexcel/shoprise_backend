import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn } from "typeorm"
import * as bcrypt from 'bcrypt'


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

    // @BeforeInsert()
    // async hashedPassword(){
    //   this.password = await bcrypt.hash(this.password, 10);
    // }

    @Column()
    password: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn()
    createdAt?:Date;

    @UpdateDateColumn()
    updatedAt?:Date;
}