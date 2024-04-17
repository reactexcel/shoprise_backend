import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"
import { User } from "./user.entity"
import { Order } from "./order.entity"
import { VehicleAsset } from "./vehicleAsset.entity"

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string
    
    @Column()
    location: string
    
    @Column()
    year: string

    @Column()
    brand: string

    @Column()
    model: string
    
    @Column()
    desc: string
    
    @Column()
    price: string
    
    @Column()
    condition: string

    @Column()
    userId:string
    
    @Column({default:false})
    favourite:boolean

    @Column()
    parentCat:string
    
    @OneToMany(() => VehicleAsset, (vehicleAsset) => vehicleAsset.vehicle)
    vehicleAsset?: VehicleAsset[]

    @ManyToOne(() => User, (user) => user.vehicle)
    user: User
    
    @OneToMany(() => Order, (order) => order.vehicle)
    order: Order

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}