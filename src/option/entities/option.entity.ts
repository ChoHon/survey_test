import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Answer } from 'src/answer/entities/answer.entity';
import { Common } from 'src/common/entities/common.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Option extends Common {
  @Column()
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => Int)
  score: number;

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.options)
  answer: Answer;
}
