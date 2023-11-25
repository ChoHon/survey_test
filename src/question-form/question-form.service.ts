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

  async getQuestionFormByFormAndQuestion(
    form_id: number,
    question_id: number,
  ): Promise<QuestionInForm> {
    const target = await this.qfRepo.findOne({
      relations: { form: true, question: true },
      where: { form: { id: form_id }, question: { id: question_id } },
    });

    return target;
  }

  async getQuestionFormById(id: number): Promise<QuestionInForm> {
    return await this.qfRepo.findOne({ where: { id } });
  }

  async addQuestionToForm(
    form_id: number,
    question_id: number,
  ): Promise<QuestionInForm> {
    try {
      const is_duplicated = await this.getQuestionFormByFormAndQuestion(
        form_id,
        question_id,
      );
      if (is_duplicated) throw new BadRequestException('이미 추가된 문항');

      const target_form = await this.formService.getFormbyId(form_id);
      const target_question =
        await this.questionService.getQuestionById(question_id);

      if (!target_form || !target_question)
        throw new NotFoundException('존재하지 않는 설문지 혹은 문항 ID');
      else if (target_form.status === FormStatus.FINISHED)
        throw new BadRequestException('종료된 설문지 ID');

      const new_qf = this.qfRepo.create({
        form: target_form,
        question: target_question,
      });

      const result = await this.qfRepo.save(new_qf);

      this.logger.log('설문지에 문항 추가 성공', 'QuestionInForm');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async removeQuestionFromForm(
    form_id: number,
    question_id: number,
  ): Promise<number> {
    try {
      const target = await this.getQuestionFormByFormAndQuestion(
        form_id,
        question_id,
      );
      if (!target) throw new NotFoundException('존재하지 않는 문항 ID');

      const result = await this.qfRepo.delete(target.id);
      if (!result.affected)
        throw new InternalServerErrorException('설문지에서 문항 삭제 실패');

      this.logger.log('설문지에서 문항 삭제 성공', 'QuestionInForm');
      return result.affected;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
