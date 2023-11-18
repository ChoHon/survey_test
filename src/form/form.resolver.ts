import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FormService } from './form.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';

@Resolver(() => Form)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation(() => Form)
  createForm(@Args('input') input: CreateFormInput) {
    return this.formService.create(input);
  }

  @Query(() => [Form])
  findAll() {
    return this.formService.findAll();
  }

  @Query(() => Form)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.formService.findOne(id);
  }

  @Mutation(() => Form)
  updateForm(@Args('input') input: UpdateFormInput) {
    return this.formService.update(input.id, input);
  }

  @Mutation(() => String)
  async removeForm(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<string> {
    const result = await this.formService.remove(id);
    return result ? 'Success' : 'Fail';
  }
}
