import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OptionGroup } from 'src/option/entities/option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionInForm as QuestionInForm } from './question-form.entity';

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => OptionGroup, (group) => group.questions)
  options: OptionGroup;

  @OneToMany(() => QuestionInForm, (qf) => qf.question)
  qf: QuestionInForm[];
}
