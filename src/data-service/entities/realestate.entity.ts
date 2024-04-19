import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"
import { User } from "./user.entity"
import { Order } from "./order.entity"
import { RealEstateAsset } from "./realestateAsset.entity"

@Entity()
export class RealEstate {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    title: string
    
    @Column()
    saleOrRent: string
    
    @Column({default:"1"})
    rooms: string

    @Column({default:"0"})
    bathRooms: string

    @Column()
    desc: string
    
    @Column()
    price: string
    
    @Column()
    location: string
    
    @Column()
    zipcode: string
    
    @Column()
    address: string
    
    @Column()
    sqFeet: string
    
    @Column()
    laundry: string
    
    @Column()
    parking: string
    
    @Column()
    airCondition: string
    
    @Column()
    heating: string

    @Column()
    userId:string
    
    @Column({default:false})
    favourite:boolean
    
    @Column()
    cat:string

    @Column({default:"real-estate"})
    parentCat: string
    
    @OneToMany(() => RealEstateAsset, (realEstateAsset) => realEstateAsset.realEstate)
    photos?: RealEstateAsset[]

    @ManyToOne(() => User, (user) => user.realEstate)
    user: User
    
    @OneToMany(() => Order, (order) => order.realEstate)
    order: Order

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}