import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { QuestionFormService } from 'src/question-form/question-form.service';
import { Repository } from 'typeorm';
import { CreateChoiceInput } from './dto/create-choice.input';
import { UpdateChoiceInput } from './dto/update-choice.input';
import { Choice } from './entities/choice.entity';

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(Choice)
    private choiceRepo: Repository<Choice>,
    private qfService: QuestionFormService,
    private optionService: OptionService,
  ) {}

  async create(input: CreateChoiceInput): Promise<Choice> {
    const { user, qf_id, option_ids } = input;
    const target_qf = await this.qfService.findOneById(qf_id);

    const target_options = [];
    for (const id of option_ids) {
      const temp = await this.optionService.findOne(id);
      target_options.push(temp);
    }

    const new_answer = this.choiceRepo.create({ user });
    new_answer.qf = target_qf;
    new_answer.options = target_options;

    return new_answer;
  }

  async findAll(): Promise<Choice[]> {
    return this.choiceRepo.find();
  }

  async findOne(id: number): Promise<Choice> {
    return this.choiceRepo.findOne({ where: { id } });
  }

  async update(id: number, input: UpdateChoiceInput): Promise<Choice> {
    const target_answer = await this.findOne(id);

    if (target_answer) {
      return await this.choiceRepo.save({ ...target_answer, ...input });
    }
  }

  async remove(id: number): Promise<number> {
    const result = await this.choiceRepo.delete(id);
    return result.affected;
  }
}
