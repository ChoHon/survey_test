import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateAnswerInput } from './create-answer.input';

@InputType()
export class UpdateAnswerInput extends PartialType(CreateAnswerInput) {
  @Field(() => Int)
  id: number;
}
