import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { BlogAsset } from './blogAsset.entity';
import { Comment } from './comment.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: '' })
  heading: string;

  @Column({ default: '', length: 5000 })
  introduction: string;

  @Column({ default: '', length: 2000 })
  about: string;

  @Column({ default: null })
  location: string;

  @Column({ default: '', length: 2000 })
  conclusion: string;

  @Column({ default: '', length: 5000 })
  note: string;

  @Column({ default: null })
  scheduledDate: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: '' })
  category: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column()
  userId: number;

  @Column({ default: false })
  commentStatus: boolean;

  @ManyToOne(() => User, (user) => user.blog)
  user: User;

  @OneToMany(() => BlogAsset, (blogAsset) => blogAsset.blog)
  photos: BlogAsset[];

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments?: Comment[];
}
