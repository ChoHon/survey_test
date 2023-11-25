import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChoiceService } from './choice.service';
import { Choice } from './entities/choice.entity';
import { CreateChoiceInput } from './dto/create-choice.input';

@Resolver(() => Choice)
export class ChoiceResolver {
  constructor(private readonly choiceService: ChoiceService) {}

  @Mutation(() => Choice, { name: 'createChoice' })
  createChoice(@Args('input') input: CreateChoiceInput) {
    return this.choiceService.createChoice(input);
  }

  @Query(() => Choice, { name: 'getChoiceById' })
  getChoiceById(@Args('id', { type: () => Int }) id: number) {
    return this.choiceService.getChoiceById(id);
  }

  @Mutation(() => Boolean, { name: 'removeChoice' })
  removeChoice(@Args('id', { type: () => Int }) id: number) {
    return this.choiceService.removeChoice(id);
  }
}
