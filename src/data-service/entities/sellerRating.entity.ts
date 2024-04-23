import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class SellerRating{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    rating:number;

    @Column()
    sellerId:number;

    @Column()
    buyerId:number;

    @ManyToOne((user) => User, (user) => user.ratingRec)
    seller:User[];

    @ManyToOne((user) => User,  (user) => user.ratingCont)
    buyer:User[];

}