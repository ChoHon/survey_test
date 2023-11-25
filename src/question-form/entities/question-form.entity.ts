import { Field, ObjectType } from '@nestjs/graphql';
import { Choice } from 'src/choice/entities/choice.entity';
import { Common } from 'src/config/entities/common.entity';
import { Form } from 'src/form/entities/form.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Question } from '../../question/entities/question.entity';

@Entity()
@ObjectType()
export class QuestionInForm extends Common {
  @ManyToOne(() => Question, (question) => question.qf, { onDelete: 'CASCADE' })
  @Field(() => Question)
  question: Question;

  @ManyToOne(() => Form, (form) => form.qf, { onDelete: 'CASCADE' })
  @Field(() => Form)
  form: Form;

  @OneToMany(() => Choice, (choice) => choice.qf)
  choices: Choice[];
}
