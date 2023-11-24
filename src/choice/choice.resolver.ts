import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChoiceService } from './choice.service';
import { Choice } from './entities/choice.entity';
import { CreateChoiceInput } from './dto/create-choice.input';

@Resolver(() => Choice)
export class ChoiceResolver {
  constructor(private readonly choiceService: ChoiceService) {}

  @Mutation(() => Choice, { name: 'createChoice' })
  createAnswer(@Args('input') input: CreateChoiceInput) {
    return this.choiceService.create(input);
  }

  @Query(() => [Choice], { name: 'findAllChoice' })
  findAll() {
    return this.choiceService.findAll();
  }

  @Query(() => Choice, { name: 'findOneChoice' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.choiceService.findOne(id);
  }

  @Mutation(() => Boolean, { name: 'removeChoice' })
  removeAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.choiceService.remove(id);
  }
}
