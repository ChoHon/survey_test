import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OptionService } from './option.service';
import { Option } from './entities/option.entity';
import { CreateOptionInput } from './dto/create-option.input';
import { UpdateOptionInput } from './dto/update-option.input';

@Resolver(() => Option)
export class OptionResolver {
  constructor(private readonly optionService: OptionService) {}

  @Mutation(() => Option, { name: 'createOption' })
  createOption(@Args('input') input: CreateOptionInput) {
    return this.optionService.create(input);
  }

  @Query(() => [Option], { name: 'findAllOption' })
  findAll() {
    return this.optionService.findAll();
  }

  @Query(() => Option, { name: 'findOneOption' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.optionService.findOne(id);
  }

  @Mutation(() => Option, { name: 'updateOption' })
  updateOption(@Args('input') input: UpdateOptionInput) {
    return this.optionService.update(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeOption' })
  removeOption(@Args('id', { type: () => Int }) id: number) {
    return this.optionService.remove(id);
  }
}
