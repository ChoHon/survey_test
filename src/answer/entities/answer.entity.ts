import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Common } from 'src/common/entities/common.entity';
import { Form } from 'src/form/entities/form.entity';
import { Option } from 'src/option/entities/option.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Answer extends Common {
  @Column()
  @Field(() => String)
  respondent: string;

  @Column()
  @Field(() => Int)
  total_score: number;

  @ManyToOne(() => Form, (form) => form.answer)
  form: Form;

  @OneToMany(() => Option, (option) => option.answer)
  options: Option[];
}
