import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionInForm } from 'src/question/entities/question-form.entity';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { Form } from './entities/form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepo: Repository<Form>,

    @InjectRepository(QuestionInForm)
    private qfRepo: Repository<QuestionInForm>,

    private questionService: QuestionService,
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
    const target_form = await this.formRepo.findOne({ where: { id } });

    if (target_form) {
      return await this.formRepo.save({ ...target_form, ...input });
    }
  }

  async remove(id: number) {
    const result = await this.formRepo.delete(id);
    return result.affected;
  }

  async findOneQuestionInForm(
    form_id: number,
    question_id: number,
  ): Promise<QuestionInForm> {
    const target = await this.qfRepo.findOne({
      relations: { form: true, question: true },
      where: { form: { id: form_id }, question: { id: question_id } },
    });

    return target;
  }

  async addQuestionToForm(form_id: number, question_id: number) {
    const is_duplicated = await this.findOneQuestionInForm(
      form_id,
      question_id,
    );

    if (!is_duplicated) {
      const target_form = await this.formRepo.findOne({
        relations: { qf: true },
        where: { id: form_id },
      });
      const target_question = await this.questionService.findOne(question_id);

      const new_qf = this.qfRepo.create({
        form: target_form,
        question: target_question,
      });

      return await this.qfRepo.save(new_qf);
    }
  }

  async removeQuestionToForm(form_id: number, question_id: number) {
    const target = await this.findOneQuestionInForm(form_id, question_id);
    await this.qfRepo.delete(target.id);

    return target;
  }
}
