import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FormService } from './form.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';

@Resolver(() => Form)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation(() => Form, { name: 'createForm' })
  createForm(@Args('input') input: CreateFormInput) {
    return this.formService.create(input);
  }

  @Query(() => [Form], { name: 'findAllForm' })
  findAll() {
    return this.formService.findAll();
  }

  @Query(() => Form, { name: 'findOneForm' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.formService.findOne(id);
  }

  @Mutation(() => Form, { name: 'updateForm' })
  updateForm(@Args('input') input: UpdateFormInput) {
    return this.formService.update(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeForm' })
  removeForm(@Args('id', { type: () => Int }) id: number) {
    return this.formService.remove(id);
  }

  @Mutation(() => Form, { name: 'finishForm' })
  finishForm(@Args('id', { type: () => Int }) id: number) {
    return this.formService.finishForm(id);
  }
}
