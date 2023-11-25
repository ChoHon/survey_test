import { ObjectType, InputType, Field } from '@nestjs/graphql';
import { Answer } from 'src/answer/entities/answer.entity';
import { Common } from 'src/common/entities/common.entity';
import { Option } from 'src/option/entities/option.entity';
import { QuestionInForm } from 'src/question-form/entities/question-form.entity';
import { Entity, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Choice extends Common {
  @ManyToOne(() => Answer, (answer) => answer.choices)
  answer: Answer;

  @ManyToOne(() => QuestionInForm, (qf) => qf.choices)
  qf: QuestionInForm;

  @ManyToOne(() => Option, (option) => option.choices)
  @Field(() => Option)
  option: Option;
}
