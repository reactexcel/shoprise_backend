import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToMany, ManyToOne, OneToOne } from "typeorm"
import { Product } from "./product.entity"
import { User } from "./user.entity"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productId: number
    
    @Column()
    userId: number

    @Column()
    address: string

    @Column()
    total: string

    @Column({default:"pending"})
    fulfilment:string
    
    @Column({default:"pending"})
    status:string
    
    @OneToOne(() => Product, (product) => product.order)
    product?:Product

    @ManyToOne(() => User, (user) => user.order)
    user: User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}