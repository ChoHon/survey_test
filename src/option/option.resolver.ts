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
    return this.optionService.createOption(input);
  }

  @Query(() => [Option], { name: 'getAllOption' })
  getAllOption() {
    return this.optionService.getAllOption();
  }

  @Query(() => Option, { name: 'getOptionById' })
  getOptionById(@Args('id', { type: () => Int }) id: number) {
    return this.optionService.getOptionById(id);
  }

  @Mutation(() => Option, { name: 'updateOption' })
  updateOption(@Args('input') input: UpdateOptionInput) {
    return this.optionService.updateOption(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeOption' })
  removeOption(@Args('id', { type: () => Int }) id: number) {
    return this.optionService.removeOption(id);
  }
}
