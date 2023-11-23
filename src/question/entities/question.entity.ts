import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Common } from 'src/common/entities/common.entity';
import { OptionGroup } from 'src/option/entities/option.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { QuestionInForm as QuestionInForm } from './question-form.entity';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Question extends Common {
  @Column()
  @Field(() => String)
  content: string;

  @ManyToOne(() => OptionGroup, (group) => group.questions)
  options: OptionGroup;

  @OneToMany(() => QuestionInForm, (qf) => qf.question)
  qf: QuestionInForm[];
}
