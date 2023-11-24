import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormService } from 'src/form/form.service';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { QuestionInForm } from './entities/question-form.entity';

@Injectable()
export class QuestionFormService {
  constructor(
    @InjectRepository(QuestionInForm)
    private qfRepo: Repository<QuestionInForm>,
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

    if (is_duplicated) throw new NotFoundException('중복 질문');

    const target_form = await this.formService.findOne(form_id);
    const target_question = await this.questionService.findOne(question_id);

    const new_qf = this.qfRepo.create({
      form: target_form,
      question: target_question,
    });

    return await this.qfRepo.save(new_qf);
  }

  async removeQuestionFromForm(
    form_id: number,
    question_id: number,
  ): Promise<number> {
    const target = await this.findOneByFormAndQuestion(form_id, question_id);

    const result = await this.qfRepo.delete(target.id);

    return result.affected;
  }
}
