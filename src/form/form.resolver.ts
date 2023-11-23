import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FormService } from './form.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { QuestionInForm } from 'src/question/entities/question-form.entity';

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

  @Mutation(() => QuestionInForm, { name: 'addQuestionToForm' })
  addQuestionToForm(
    @Args('form_id', { type: () => Int }) form_id: number,
    @Args('question_id', { type: () => Int }) question_id: number,
  ): Promise<QuestionInForm> {
    return this.formService.addQuestionToForm(form_id, question_id);
  }

  @Mutation(() => QuestionInForm, { name: 'removeQuestionToForm' })
  removeQuestionToForm(
    @Args('form_id', { type: () => Int }) form_id: number,
    @Args('question_id', { type: () => Int }) question_id: number,
  ): Promise<QuestionInForm> {
    return this.formService.removeQuestionToForm(form_id, question_id);
  }
}
