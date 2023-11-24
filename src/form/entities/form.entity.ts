import {
  ObjectType,
  Field,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { Answer } from 'src/answer/entities/answer.entity';
import { Common } from 'src/common/entities/common.entity';
import { QuestionInForm } from 'src/question-form/entities/question-form.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum FormStatus {
  STANDBY = 0,
  ONGOING = 1,
  COMPLETE = 2,
}

registerEnumType(FormStatus, { name: 'FormStatus' });

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

  @Column({ type: 'enum', enum: FormStatus, default: FormStatus.STANDBY })
  @Field(() => FormStatus)
  status: FormStatus;

  @OneToMany(() => QuestionInForm, (qf) => qf.form)
  @Field(() => [QuestionInForm])
  qf: QuestionInForm[];

  @OneToMany(() => Answer, (answer) => answer.form)
  @Field(() => [Answer])
  answer: Answer[];
}
