import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinTable, OneToOne, JoinColumn } from "typeorm"
import { Product } from "./product.entity"
import { User } from "./user.entity"
import { Vehicle } from "./vehicle.entity"
import { RealEstate } from "./realestate.entity"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:true})
    productId: number

    @Column({nullable:true})
    vehicleId: number

    @Column({nullable:true})
    realEstateId: number
    
    @Column()
    buyerId: number

    @Column()
    address: string

    @Column()
    total: string

    @Column({default:"$ 0"})
    offerApplied: string

    @Column({default:"pending"})
    fulfilment:string
    
    @Column({default:"pending"})
    status:string
        
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.order)
    product:Product[]
    
    @ManyToOne(() => Vehicle, (vehicle) => vehicle.order)
    vehicle:Vehicle[]
    
    @ManyToOne(() => RealEstate, (realEstate) => realEstate.order)
    realEstate:RealEstate[]
    

    @ManyToOne(() => User, (user) => user.order)
    buyer: User
    
}