import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Choice } from 'src/answer/entities/choice.entity';
import { Common } from 'src/common/entities/common.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @OneToMany(() => Choice, (choice) => choice.option)
  choice: Choice[];
}
