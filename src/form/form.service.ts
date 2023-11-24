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
    private formRepo: Repository<Form>,
  ) {}

  async create(input: CreateFormInput): Promise<Form> {
    const new_form = this.formRepo.create(input);

    return await this.formRepo.save(new_form);
  }

  async findAll(): Promise<Form[]> {
    return this.formRepo.find();
  }

  async findOne(id: number): Promise<Form> {
    return this.formRepo.findOne({ where: { id } });
  }

  async update(id: number, input: UpdateFormInput): Promise<Form> {
    const target_form = await this.findOne(id);

    if (target_form) {
      return await this.formRepo.save({ ...target_form, ...input });
    }
  }

  async remove(id: number): Promise<number> {
    const result = await this.formRepo.delete(id);
    return result.affected;
  }
}
