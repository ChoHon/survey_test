import { Field, ObjectType } from '@nestjs/graphql';
import { Common } from 'src/common/entities/common.entity';
import { Form } from 'src/form/entities/form.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Question } from '../../question/entities/question.entity';

@Entity()
@ObjectType()
export class QuestionInForm extends Common {
  @ManyToOne(() => Question, (question) => question.qf)
  @Field(() => Question)
  question: Question;

  @ManyToOne(() => Form, (form) => form.qf)
  @Field(() => Form)
  form: Form;
}
