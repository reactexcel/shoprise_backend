import { PrimaryGeneratedColumn, Column ,Entity , ManyToOne } from "typeorm";
import { Blog } from "./blog.entity";

@Entity()
export class BlogAsset{
    @PrimaryGeneratedColumn()
    id?:number;
     
    @Column({default:null, nullable:true})
    imageUrl:string

    @Column()
    blogId:number

    @ManyToOne(()=>Blog, (blog) => blog.photos)
    blog:Blog

}