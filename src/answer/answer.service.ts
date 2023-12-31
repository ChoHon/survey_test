import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChoiceService } from 'src/choice/choice.service';
import { Choice } from 'src/choice/entities/choice.entity';
import { FormStatus } from 'src/form/entities/form.entity';
import { FormService } from 'src/form/form.service';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepo: Repository<Answer>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,

    private choiceService: ChoiceService,
    private formService: FormService,
  ) {}

  async createAnswer(input: CreateAnswerInput) {
    try {
      const target_form = await this.formService.getFormbyId(input.form_id);

      if (!target_form) throw new NotFoundException('존재하지 않는 설문지 ID');
      else if (target_form.status === FormStatus.FINISHED)
        throw new BadRequestException('종료된 설문지');

      const new_answer = this.answerRepo.create(input);
      new_answer.form = target_form;
      const result = await this.answerRepo.save(new_answer);

      this.logger.log('답변 생성 성공', 'Answer');
      return result;
    } catch (error) {
      const msg = '답변 생성 실패';
      this.logger.error(msg, error.stack);
      throw new InternalServerErrorException(msg);
    }
  }

  async getAllAnswer() {
    return this.answerRepo.find();
  }

  async getAnswerById(id: number) {
    return this.answerRepo.findOne({ where: { id } });
  }

  async updateAnswer(id: number, input: UpdateAnswerInput) {
    try {
      const target_answer = await this.getAnswerById(id);

      if (!target_answer) throw new NotFoundException('존재하지 않는 답변 ID');

      const result = await this.answerRepo.save({ ...target_answer, ...input });
      this.logger.log('답변 수정 성공', 'Answer');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async removeAnswer(id: number): Promise<number> {
    try {
      const result = await this.answerRepo.delete(id);

      if (!result.affected)
        throw new InternalServerErrorException('답변 삭제 실패');

      this.logger.log('답변 삭제 성공', 'Answer');
      return result.affected;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async addChoiceToAnswer(
    answer_id: number,
    choice_id: number,
  ): Promise<Answer> {
    try {
      const target_answer = await this.getAnswerById(answer_id);
      const target_choice = await this.choiceService.getChoiceById(choice_id);

      if (!target_answer || !target_choice)
        throw new NotFoundException('존재하지 않는 답변 혹은 Choice ID');

      if (target_answer.form.id !== target_choice.qf.form.id)
        throw new BadRequestException('잘못된 답변과 선택');

      if (target_answer.form.status === FormStatus.FINISHED)
        throw new BadRequestException('종료된 설문지');

      target_answer.choices = target_answer.choices
        ? [...target_answer.choices, target_choice]
        : [target_choice];

      const result = await this.answerRepo.save(target_answer);
      this.logger.log('답변에 Choice 추가 성공', 'Answer');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async removeChoiceFromAnswer(
    answer_id: number,
    choice_id: number,
  ): Promise<Answer> {
    try {
      const target_answer = await this.getAnswerById(answer_id);
      const target_choice = await this.choiceService.getChoiceById(choice_id);

      if (!target_answer || !target_choice)
        throw new NotFoundException('존재하지 않는 답변 혹은 Choice ID');

      target_answer.choices = target_answer.choices.filter(
        (choice: Choice) => choice.id !== choice_id,
      );

      const result = await this.answerRepo.save(target_answer);
      this.logger.log('답변에서 Choice 삭제 성공', 'Answer');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async finishAnswer(id: number): Promise<Answer> {
    try {
      const target_answer = await this.getAnswerById(id);

      if (!target_answer) throw new NotFoundException('존재하지 않는 답변 ID');
      if (target_answer.is_finished === true)
        throw new BadRequestException('이미 완료된 답변');

      target_answer.is_finished = true;
      target_answer.total_score = target_answer.choices.reduce(
        (total: number, choice: Choice) => (total += choice.option.score),
        0,
      );
      return await this.answerRepo.save(target_answer);
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async getAllFinishedAnswer(): Promise<Answer[]> {
    return await this.answerRepo.find({
      where: { is_finished: true },
    });
  }
}
