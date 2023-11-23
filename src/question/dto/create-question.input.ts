import { InputType, PickType } from '@nestjs/graphql';
import { Question } from '../entities/question.entity';

@InputType()
export class CreateQuestionInput extends PickType(Question, [
  'content',
] as const) {}
