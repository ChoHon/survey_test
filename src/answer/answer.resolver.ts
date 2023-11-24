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
    return this.answerService.create(input);
  }

  @Query(() => [Answer], { name: 'findAllAnswer' })
  findAll() {
    return this.answerService.findAll();
  }

  @Query(() => Answer, { name: 'findOneAnswer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.findOne(id);
  }

  @Mutation(() => Answer, { name: 'updateAnswer' })
  updateAnswer(@Args('input') input: UpdateAnswerInput) {
    return this.answerService.update(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeAnswer' })
  removeAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.remove(id);
  }
}
