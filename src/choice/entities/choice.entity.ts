import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Common } from 'src/common/entities/common.entity';
import { Option } from 'src/option/entities/option.entity';
import { QuestionInForm } from 'src/question-form/entities/question-form.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Choice extends Common {
  @Column()
  @Field(() => String)
  user: string;

  @ManyToOne(() => QuestionInForm, (qf) => qf.choices)
  qf: QuestionInForm;

  @ManyToMany(() => Option)
  @JoinTable()
  options: Option[];
}
