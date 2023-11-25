import { ObjectType, InputType, Field } from '@nestjs/graphql';
import { Common } from 'src/config/entities/common.entity';
import { Option } from 'src/option/entities/option.entity';
import { QuestionInForm } from 'src/question-form/entities/question-form.entity';
import { Entity, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Choice extends Common {
  @ManyToOne(() => QuestionInForm, (qf) => qf.choices, { onDelete: 'CASCADE' })
  qf: QuestionInForm;

  @ManyToOne(() => Option, (option) => option.choices, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field(() => Option)
  option: Option;
}
