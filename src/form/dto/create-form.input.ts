import { InputType, PickType } from '@nestjs/graphql';
import { Form } from '../entities/form.entity';

@InputType()
export class CreateFormInput extends PickType(Form, [
  'name',
  'description',
] as const) {}
