import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Option } from '../entities/option.entity';

@InputType()
export class CreateOptionInput extends PickType(Option, [
  'content',
  'score',
] as const) {
  @Field(() => Int)
  question_id: number;
}
