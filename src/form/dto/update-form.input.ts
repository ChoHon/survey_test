import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Form } from '../entities/form.entity';

@InputType()
export class UpdateFormInput extends PartialType(
  PickType(Form, ['id', 'name', 'description'] as const),
) {}
