import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChoiceService } from 'src/choice/choice.service';
import { Choice } from 'src/choice/entities/choice.entity';
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
  ) {}

  async createAnswer(input: CreateAnswerInput) {
    const new_answer = this.answerRepo.create(input);
    const result = await this.answerRepo.save(new_answer);

    this.logger.log('답변 생성 성공', 'Answer');
    return result;
  }

  async findAllAnswer() {
    return this.answerRepo.find();
  }

  async findOneAnswer(id: number) {
    return this.answerRepo.findOne({ where: { id } });
  }

  async updateAnswer(id: number, input: UpdateAnswerInput) {
    const target_answer = await this.findOneAnswer(id);

    if (!target_answer) {
      const msg = '존재하지 않는 답변 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    const result = await this.answerRepo.save({ ...target_answer, ...input });
    this.logger.log('답변 수정 성공', 'Answer');
    return result;
  }

  async removeAnswer(id: number): Promise<number> {
    const result = await this.answerRepo.delete(id);

    if (!result.affected) {
      const msg = '답변 삭제 실패';
      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }

    this.logger.log('답변 삭제 성공', 'Answer');
    return result.affected;
  }

  async addChoiceToAnswer(
    answer_id: number,
    choice_id: number,
  ): Promise<Answer> {
    const target_answer = await this.findOneAnswer(answer_id);
    const target_choice = await this.choiceService.findOneChoice(choice_id);

    if (!target_answer || !target_choice) {
      const msg = '존재하지 않는 답변 혹은 Choice ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    target_answer.choices = target_answer.choices
      ? [...target_answer.choices, target_choice]
      : [target_choice];

    target_answer.total_score += target_choice.option.score;

    const result = await this.answerRepo.save(target_answer);
    this.logger.log('답변에 Choice 추가 성공', 'Answer');
    return result;
  }

  async removeChoiceFromAnswer(
    answer_id: number,
    choice_id: number,
  ): Promise<Answer> {
    const target_answer = await this.findOneAnswer(answer_id);
    const target_choice = await this.choiceService.findOneChoice(choice_id);

    if (!target_answer || !target_choice) {
      const msg = '존재하지 않는 답변 혹은 Choice ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    target_answer.choices = target_answer.choices.filter(
      (choice: Choice) => choice.id !== choice_id,
    );

    target_answer.total_score -= target_choice.option.score;

    const result = await this.answerRepo.save(target_answer);
    this.logger.log('답변에서 Choice 삭제 성공', 'Answer');
    return result;
  }
}
