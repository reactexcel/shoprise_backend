import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Product } from "./product.entity"

@Entity()
export class productAsset {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({})
    productId: string
    
    @Column({ default: "" })
    url: string

    @ManyToOne(() => Product, (product) => product.photos)
    product: Product
}