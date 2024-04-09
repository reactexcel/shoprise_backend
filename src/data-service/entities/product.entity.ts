import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToMany, ManyToOne } from "typeorm"
import { productAsset } from "./productAsset.entity"
import { User } from "./user.entity"

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string
    
    @Column()
    desc: string

    @Column()
    price: string
    
    @Column()
    deliveryFee: string

    @Column()
    location: string

    @Column()
    cat: string

    @Column()
    userId:string
    
    @Column({default:false})
    favourite:boolean
    
    @OneToMany(() => productAsset, (photo) => photo.product)
    photos?: productAsset[]

    @ManyToOne(() => User, (user) => user.product)
    user: User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}