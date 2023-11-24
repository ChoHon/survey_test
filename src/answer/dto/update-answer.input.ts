import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { Answer } from '../entities/answer.entity';

@InputType()
export class UpdateAnswerInput extends PartialType(
  PickType(Answer, ['user'] as const),
) {
  @Field(() => Int)
  id: number;
}
