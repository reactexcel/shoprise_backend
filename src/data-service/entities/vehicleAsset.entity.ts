import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Product } from "./product.entity"
import { Vehicle } from "./vehicle.entity"

@Entity()
export class VehicleAsset {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({})
    vehicleId: string
    
    @Column({ default: "" })
    url: string

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.vehicleAsset)
    vehicle: Vehicle
}