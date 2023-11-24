import { InputType, Field, Int, PartialType, PickType } from '@nestjs/graphql';
import { Choice } from '../entities/choice.entity';

@InputType()
export class UpdateChoiceInput extends PartialType(
  PickType(Choice, ['user'] as const),
) {
  @Field(() => Int)
  id: number;
}
