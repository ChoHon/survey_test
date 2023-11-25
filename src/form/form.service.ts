import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { Form, FormStatus } from './entities/form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepo: Repository<Form>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  async createForm(input: CreateFormInput): Promise<Form> {
    const new_form = this.formRepo.create(input);
    const result = await this.formRepo.save(new_form);

    this.logger.log(`설문지 생성 성공`, 'Form');
    return result;
  }

  async findAllForm(): Promise<Form[]> {
    return this.formRepo.find();
  }

  async findOneForm(id: number): Promise<Form> {
    return this.formRepo.findOne({ where: { id } });
  }

  async updateForm(id: number, input: UpdateFormInput): Promise<Form> {
    const target_form = await this.findOneForm(id);

    if (!target_form) {
      const msg = '존재하지 않는 설문지 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    const result = await this.formRepo.save({ ...target_form, ...input });
    this.logger.log('설문지 수정 성공', 'Form');

    return result;
  }

  async removeForm(id: number): Promise<number> {
    const result = await this.formRepo.delete(id);

    if (!result.affected) {
      const msg = '설문지 삭제 실패';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    this.logger.log('설문지 삭제 성공', 'Form');
    return result.affected;
  }

  async finishForm(id: number): Promise<Form> {
    const target_form = await this.findOneForm(id);

    if (!target_form) {
      const msg = '존재하지 않는 설문지 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    target_form.status = FormStatus.FINISHED;
    const result = await this.formRepo.save(target_form);

    this.logger.log('설문지 완료 성공', 'Form');
    return result;
  }
}
