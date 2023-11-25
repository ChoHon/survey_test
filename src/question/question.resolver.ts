import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => Question, { name: 'createQuestion' })
  createQuestion(@Args('input') input: CreateQuestionInput) {
    return this.questionService.createQuestion(input);
  }

  @Query(() => [Question], { name: 'getAllQuestion' })
  getAllQuestion() {
    return this.questionService.getAllQuestion();
  }

  @Query(() => Question, { name: 'getQuestionById' })
  getQuestionById(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.getQuestionById(id);
  }

  @Mutation(() => Question, { name: 'updateQuestion' })
  updateQuestion(@Args('input') input: UpdateQuestionInput) {
    return this.questionService.updateQuestion(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeQuestion' })
  removeQuestion(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.removeQuestion(id);
  }
}
