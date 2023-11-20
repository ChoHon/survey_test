import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Question } from 'src/question/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class OptionGroup {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @OneToMany(() => Option, (option) => option.group)
  options: Option[];

  @OneToMany(() => Question, (question) => question.options)
  questions: Question[];
}

@Entity()
@ObjectType()
export class Option {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: false })
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => Int)
  score: number;

  @Column()
  @Field(() => Int)
  option_number: number;

  @ManyToOne(() => OptionGroup, (group) => group.options)
  group: OptionGroup;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
