import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToMany, ManyToOne, OneToOne } from "typeorm"
import { productAsset } from "./productAsset.entity"
import { User } from "./user.entity"
import { Order } from "./order.entity"

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
    
    @OneToOne(() => Order, (order) => order.product)
    order: Order

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}