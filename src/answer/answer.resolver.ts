import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => Answer, { name: 'createAnswer' })
  createAnswer(@Args('input') input: CreateAnswerInput) {
    return this.answerService.createAnswer(input);
  }

  @Query(() => [Answer], { name: 'getAllAnswer' })
  getAllAnswer() {
    return this.answerService.getAllAnswer();
  }

  @Query(() => Answer, { name: 'getAnswerById' })
  getAnswerById(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.getAnswerById(id);
  }

  @Mutation(() => Answer, { name: 'updateAnswer' })
  updateAnswer(@Args('input') input: UpdateAnswerInput) {
    return this.answerService.updateAnswer(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeAnswer' })
  removeAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.removeAnswer(id);
  }

  @Mutation(() => Answer, { name: 'addChoiceToAnswer' })
  addChoiceToAnswer(
    @Args('answer_id', { type: () => Int }) answer_id: number,
    @Args('choice_id', { type: () => Int }) choice_id: number,
  ) {
    return this.answerService.addChoiceToAnswer(answer_id, choice_id);
  }

  @Mutation(() => Answer, { name: 'removeChoiceFromAnswer' })
  removeChoiceFromAnswer(
    @Args('answer_id', { type: () => Int }) answer_id: number,
    @Args('choice_id', { type: () => Int }) choice_id: number,
  ) {
    return this.answerService.removeChoiceFromAnswer(answer_id, choice_id);
  }
}
