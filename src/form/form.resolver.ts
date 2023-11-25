import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FormService } from './form.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Resolver(() => Form)
export class FormResolver {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
    private readonly formService: FormService,
  ) {}

  @Mutation(() => Form, { name: 'createForm' })
  createForm(@Args('input') input: CreateFormInput) {
    return this.formService.createForm(input);
  }

  @Query(() => [Form], { name: 'getAllForm' })
  async getAllForm() {
    return this.formService.getAllForm();
  }

  @Query(() => Form, { name: 'getForm' })
  async getFormbyId(@Args('id', { type: () => Int }) id: number) {
    return this.formService.getFormbyId(id);
  }

  @Mutation(() => Form, { name: 'updateForm' })
  updateForm(@Args('input') input: UpdateFormInput) {
    return this.formService.updateForm(input.id, input);
  }

  @Mutation(() => Boolean, { name: 'removeForm' })
  removeForm(@Args('id', { type: () => Int }) id: number) {
    return this.formService.removeForm(id);
  }

  @Mutation(() => Form, { name: 'finishForm' })
  finishForm(@Args('id', { type: () => Int }) id: number) {
    return this.formService.finishForm(id);
  }
}
