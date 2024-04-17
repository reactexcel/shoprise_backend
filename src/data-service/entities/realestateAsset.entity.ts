import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { RealEstate } from "./realestate.entity"


@Entity()
export class RealEstateAsset {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({})
    realEstateId: string
    
    @Column({ default: "" })
    url: string

    @ManyToOne(() => RealEstate, (realEstate) => realEstate.photos)
    realEstate: RealEstate
}