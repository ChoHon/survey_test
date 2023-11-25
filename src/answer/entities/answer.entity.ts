import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';
import { Choice } from 'src/choice/entities/choice.entity';
import { Common } from 'src/common/entities/common.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Answer extends Common {
  @Column()
  @Field(() => String)
  user: string;

  @Column({ default: 0 })
  @Field(() => Int)
  total_score: number;

  @ManyToMany(() => Choice)
  @JoinTable()
  @Field(() => [Choice])
  choices: Choice[];
}
