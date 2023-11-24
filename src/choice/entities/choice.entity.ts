import { ObjectType, InputType } from '@nestjs/graphql';
import { Answer } from 'src/answer/entities/answer.entity';
import { Common } from 'src/common/entities/common.entity';
import { Option } from 'src/option/entities/option.entity';
import { QuestionInForm } from 'src/question-form/entities/question-form.entity';
import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Choice extends Common {
  @ManyToOne(() => Answer, (answer) => answer.choices)
  answer: Answer;

  @ManyToOne(() => QuestionInForm, (qf) => qf.choices)
  qf: QuestionInForm;

  @ManyToMany(() => Option)
  @JoinTable()
  options: Option[];
}
