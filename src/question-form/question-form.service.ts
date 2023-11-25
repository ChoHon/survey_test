import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FormStatus } from 'src/form/entities/form.entity';
import { FormService } from 'src/form/form.service';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { QuestionInForm } from './entities/question-form.entity';

@Injectable()
export class QuestionFormService {
  constructor(
    @InjectRepository(QuestionInForm)
    private qfRepo: Repository<QuestionInForm>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,

    private formService: FormService,
    private questionService: QuestionService,
  ) {}

  async findOneByFormAndQuestion(
    form_id: number,
    question_id: number,
  ): Promise<QuestionInForm> {
    const target = await this.qfRepo.findOne({
      relations: { form: true, question: true },
      where: { form: { id: form_id }, question: { id: question_id } },
    });

    return target;
  }

  async findOneById(id: number): Promise<QuestionInForm> {
    return await this.qfRepo.findOne({ where: { id } });
  }

  async addQuestionToForm(
    form_id: number,
    question_id: number,
  ): Promise<QuestionInForm> {
    const is_duplicated = await this.findOneByFormAndQuestion(
      form_id,
      question_id,
    );

    if (is_duplicated) {
      const msg = '이미 추가된 문항';
      this.logger.error(msg);
      throw new BadRequestException(msg);
    }

    const target_form = await this.formService.findOneForm(form_id);
    if (!target_form) {
      const msg = '존재하지 않는 설문지 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    } else if (target_form.status === FormStatus.FINISHED) {
      const msg = '종료된 설문지 ID';
      this.logger.error(msg);
      throw new BadRequestException(msg);
    }

    const target_question =
      await this.questionService.findOneQuestion(question_id);
    if (!target_question) {
      const msg = '존재하지 않는 문항 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }
    const new_qf = this.qfRepo.create({
      form: target_form,
      question: target_question,
    });

    const result = await this.qfRepo.save(new_qf);

    this.logger.log('설문지에 문항 추가 성공', 'QuestionInForm');
    return result;
  }

  async removeQuestionFromForm(
    form_id: number,
    question_id: number,
  ): Promise<number> {
    const target = await this.findOneByFormAndQuestion(form_id, question_id);
    if (!target) {
      const msg = '존재하지 않는 문항 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }
    const result = await this.qfRepo.delete(target.id);

    if (!result.affected) {
      const msg = '설문지에서 문항 삭제 실패';
      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }

    this.logger.log('설문지에서 문항 삭제 성공', 'QuestionInForm');
    return result.affected;
  }
}
