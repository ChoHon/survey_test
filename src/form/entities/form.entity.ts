import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Form {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  @Field(() => String)
  name: string;

  @Column({
    type: 'text',
    default: '',
  })
  @Field(() => String)
  description: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
