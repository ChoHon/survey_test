import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { Option } from '../entities/option.entity';

@InputType()
export class UpdateOptionInput extends PartialType(
  PickType(Option, ['content', 'score'] as const),
) {
  @Field(() => Int)
  id: number;
}
