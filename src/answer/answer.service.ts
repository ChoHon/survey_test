import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChoiceService } from 'src/choice/choice.service';
import { Choice } from 'src/choice/entities/choice.entity';
import { Repository } from 'typeorm';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepo: Repository<Answer>,
    private choiceService: ChoiceService,
  ) {}

  async create(input: CreateAnswerInput) {
    const new_answer = this.answerRepo.create(input);

    return await this.answerRepo.save(new_answer);
  }

  async findAll() {
    return this.answerRepo.find();
  }

  async findOne(id: number) {
    return this.answerRepo.findOne({
      relations: { choices: true },
      where: { id },
    });
  }

  async update(id: number, input: UpdateAnswerInput) {
    const target_answer = await this.findOne(id);

    if (target_answer) {
      return await this.answerRepo.save({ ...target_answer, ...input });
    }
  }

  async remove(id: number) {
    const result = await this.answerRepo.delete(id);
    return result.affected;
  }

  async findOneAnswerWithOpion(id: number): Promise<Answer> {
    return await this.answerRepo.findOne({
      relations: { choices: { option: true } },
      where: { id },
    });
  }

  async addChoiceToAnswer(
    answer_id: number,
    choice_id: number,
  ): Promise<Answer> {
    const target_answer = await this.findOneAnswerWithOpion(answer_id);
    const target_choice = await this.choiceService.findOne(choice_id);

    if (target_answer && target_choice) {
      target_answer.choices = target_answer.choices
        ? [...target_answer.choices, target_choice]
        : [target_choice];

      target_answer.total_score += target_choice.option.score;

      return await this.answerRepo.save(target_answer);
    }
  }

  async removeChoiceFromAnswer(
    answer_id: number,
    choice_id: number,
  ): Promise<Answer> {
    const target_answer = await this.findOneAnswerWithOpion(answer_id);
    const target_choice = await this.choiceService.findOne(choice_id);

    if (target_answer && target_choice) {
      target_answer.choices = target_answer.choices.filter(
        (choice: Choice) => choice.id !== choice_id,
      );

      target_answer.total_score -= target_choice.option.score;

      return await this.answerRepo.save(target_answer);
    }
  }
}
