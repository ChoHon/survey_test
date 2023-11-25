import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Choice } from 'src/choice/entities/choice.entity';
import { Common } from 'src/config/entities/common.entity';
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

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @OneToMany(() => Choice, (choice) => choice.option)
  choices: Choice[];
}
