import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { QuestionInForm } from './entities/question-form.entity';
import { QuestionFormService } from './question-form.service';

@Resolver()
export class QuestionFormResolver {
  constructor(private readonly qfService: QuestionFormService) {}

  @Mutation(() => QuestionInForm, { name: 'addQuestionToForm' })
  addQuestionToForm(
    @Args('form_id', { type: () => Int }) form_id: number,
    @Args('question_id', { type: () => Int }) question_id: number,
  ): Promise<QuestionInForm> {
    return this.qfService.addQuestionToForm(form_id, question_id);
  }

  @Mutation(() => QuestionInForm, { name: 'removeQuestionFromForm' })
  removeQuestionFromForm(
    @Args('form_id', { type: () => Int }) form_id: number,
    @Args('question_id', { type: () => Int }) question_id: number,
  ): Promise<QuestionInForm> {
    return this.qfService.removeQuestionFromForm(form_id, question_id);
  }
}
