import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { QuestionFormService } from 'src/question-form/question-form.service';
import { Repository } from 'typeorm';
import { CreateChoiceInput } from './dto/create-choice.input';
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
    const { qf_id, option_id } = input;
    const target_qf = await this.qfService.findOneById(qf_id);
    const target_option = await this.optionService.findOneOption(option_id);

    const new_choice = this.choiceRepo.create();
    new_choice.qf = target_qf;
    new_choice.option = target_option;

    return await this.choiceRepo.save(new_choice);
  }

  async findAll(): Promise<Choice[]> {
    return this.choiceRepo.find();
  }

  async findOne(id: number): Promise<Choice> {
    return this.choiceRepo.findOne({ where: { id } });
  }

  async remove(id: number): Promise<number> {
    const result = await this.choiceRepo.delete(id);
    return result.affected;
  }
}
