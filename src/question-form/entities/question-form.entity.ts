import { ObjectType } from '@nestjs/graphql';
import { Choice } from 'src/answer/entities/choice.entity';
import { Common } from 'src/common/entities/common.entity';
import { Form } from 'src/form/entities/form.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Question } from '../../question/entities/question.entity';

@Entity()
@ObjectType()
export class QuestionInForm extends Common {
  @ManyToOne(() => Question, (question) => question.qf)
  question: Question;

  @ManyToOne(() => Form, (form) => form.qf)
  form: Form;

  @OneToMany(() => Choice, (choice) => choice.qf)
  choice: Choice;
}
