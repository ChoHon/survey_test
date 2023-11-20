import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { Form } from './entities/form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {}

  async create(input: CreateFormInput): Promise<Form> {
    const new_form = this.formRepository.create(input);

    return await this.formRepository.save(new_form);
  }

  async findAll(): Promise<Form[]> {
    return this.formRepository.find();
  }

  async findOne(id: number): Promise<Form> {
    return this.formRepository.findOne({ where: { id } });
  }

  async update(id: number, input: UpdateFormInput): Promise<Form> {
    const target_form = await this.formRepository.findOne({ where: { id } });

    if (target_form) {
      return await this.formRepository.save({ ...target_form, ...input });
    }
  }

  async remove(id: number) {
    const result = await this.formRepository.delete(id);
    return result.affected;
  }
}
