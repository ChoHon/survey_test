import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Answer } from 'src/answer/entities/answer.entity';
import { Common } from 'src/common/entities/common.entity';
import { QuestionInForm } from 'src/question-form/entities/question-form.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Form extends Common {
  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column({ type: 'text', default: '' })
  @Field(() => String)
  description: string;

  @OneToMany(() => QuestionInForm, (qf) => qf.form)
  qf: QuestionInForm[];

  @OneToMany(() => Answer, (answer) => answer.form)
  answer: Answer[];
}
