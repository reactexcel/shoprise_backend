import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToMany } from "typeorm"
import { productAsset } from "./productAsset.entity"

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    price: string
    
    @Column()
    deliveryFee: string

    @Column()
    location: string

    @Column()
    cat: string
    
    @OneToMany(() => productAsset, (photo) => photo.product)
    photos?: productAsset[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}