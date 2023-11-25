import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Question } from 'src/question/entities/question.entity';
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
    try {
      const new_form = this.formRepo.create(input);
      const result = await this.formRepo.save(new_form);

      this.logger.log(`설문지 생성 성공`, 'Form');
      return result;
    } catch (error) {
      const msg = '설문지 생성 실패';
      this.logger.error(msg, error.stack);
      throw new InternalServerErrorException(msg);
    }
  }

  async getAllForm(): Promise<Form[]> {
    return this.formRepo.find();
  }

  async getFormbyId(id: number): Promise<Form> {
    return this.formRepo.findOne({ where: { id } });
  }

  async updateForm(id: number, input: UpdateFormInput): Promise<Form> {
    try {
      const target_form = await this.getFormbyId(id);

      if (!target_form) throw new NotFoundException('존재하지 않는 설문지 ID');

      const result = await this.formRepo.save({ ...target_form, ...input });
      this.logger.log('설문지 수정 성공', 'Form');

      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async removeForm(id: number): Promise<number> {
    try {
      const result = await this.formRepo.delete(id);

      if (!result.affected)
        throw new InternalServerErrorException('설문지 삭제 실패');

      this.logger.log('설문지 삭제 성공', 'Form');
      return result.affected;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async finishForm(id: number): Promise<Form> {
    try {
      const target_form = await this.getFormbyId(id);

      if (!target_form) throw new NotFoundException('존재하지 않는 설문지 ID');

      target_form.status = FormStatus.FINISHED;
      const result = await this.formRepo.save(target_form);

      this.logger.log('설문지 완료 성공', 'Form');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async getAllQuestionFromForm(id: number): Promise<Question[]> {
    try {
      const target_form = await this.formRepo.findOne({
        relations: { qf: { question: true } },
        where: { id },
      });

      if (!target_form) throw new NotFoundException('존재하지 않는 설문지 ID');

      const result = [];
      for (const qf of target_form.qf) {
        result.push(qf.question);
      }

      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
