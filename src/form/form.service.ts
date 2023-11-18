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
    const { name, description } = input;
    const new_form = this.formRepository.create({ name, description });

    await this.formRepository.save(new_form);
    return new_form;
  }

  async findAll(): Promise<Form[]> {
    return this.formRepository.find();
  }

  findOne(id: number): Promise<Form> {
    return this.formRepository.findOneBy({ id });
  }

  async update(id: number, input: UpdateFormInput): Promise<Form> {
    const { name, description } = input;
    const target_form = await this.findOne(id);

    target_form.name = name;
    target_form.description = description;

    await this.formRepository.save(target_form);
    return target_form;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.formRepository.delete({ id });

    return result.affected ? true : false;
  }
}
