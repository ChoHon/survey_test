import { InputType, Int, Field, PickType } from '@nestjs/graphql';
import { Choice } from '../entities/choice.entity';

@InputType()
export class CreateChoiceInput extends PickType(Choice, ['user'] as const) {
  @Field(() => Int)
  qf_id: number;

  @Field(() => [Int])
  option_ids: number[];
}
