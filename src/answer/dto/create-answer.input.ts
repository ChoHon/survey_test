import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Answer } from '../entities/answer.entity';

@InputType()
export class CreateAnswerInput extends PickType(Answer, ['user'] as const) {
  @Field(() => Int)
  form_id: number;
}
