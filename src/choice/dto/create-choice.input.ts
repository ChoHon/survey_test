import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChoiceInput {
  @Field(() => Int)
  qf_id: number;

  @Field(() => [Int])
  option_ids: number[];
}
