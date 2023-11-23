import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Question } from '../entities/question.entity';

@InputType()
export class UpdateQuestionInput extends PartialType(
  PickType(Question, ['id', 'content'] as const),
) {}
