import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Common } from 'src/common/entities/common.entity';
import { Option } from 'src/option/entities/option.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { QuestionInForm as QuestionInForm } from '../../question-form/entities/question-form.entity';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Question extends Common {
  @Column()
  @Field(() => String)
  content: string;

  @OneToMany(() => Option, (option) => option.question)
  @Field(() => [Option])
  options: Option[];

  @OneToMany(() => QuestionInForm, (qf) => qf.question)
  qf: QuestionInForm[];
}
