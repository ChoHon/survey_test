import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Answer } from 'src/answer/entities/answer.entity';
import { QuestionInForm } from 'src/question/entities/question-form.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @Column({ type: 'text', default: '' })
  @Field(() => String)
  description: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;

  @OneToMany(() => QuestionInForm, (qtf) => qtf.form)
  qf: QuestionInForm[];

  @OneToMany(() => Answer, (answer) => answer.form)
  answer: Answer[];
}
