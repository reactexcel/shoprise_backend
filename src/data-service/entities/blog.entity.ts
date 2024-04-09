import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { User } from "./user.entity"
import { BlogAsset } from "./blogAsset.entity"

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    heading: string

    @Column({default:""})
    introduction: string

    @Column({default:""})
    conclusion: string

    @Column({default:""})
    note:string
    
    @Column({default:""})
    category: string

    @CreateDateColumn()
    createdAt?:Date;

    @Column()
    userId: number

    @ManyToOne(() => User, (user)=> user.blog )
    user:User

    @OneToMany(() => BlogAsset, (blogAsset)=>blogAsset.blog)
    assets:BlogAsset[]
}