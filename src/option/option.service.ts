import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { CreateOptionInput } from './dto/create-option.input';
import { UpdateOptionInput } from './dto/update-option.input';
import { Option } from './entities/option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private optionRepo: Repository<Option>,
    private questionService: QuestionService,
  ) {}

  async create(input: CreateOptionInput): Promise<Option> {
    const { question_id, ...rest } = input;
    const target_question =
      await this.questionService.findOneQuestion(question_id);

    if (target_question) {
      const new_option = this.optionRepo.create(rest);
      new_option.question = target_question;

      return await this.optionRepo.save(new_option);
    }
  }

  async findAll(): Promise<Option[]> {
    return this.optionRepo.find();
  }

  async findOne(id: number): Promise<Option> {
    return this.optionRepo.findOne({ where: { id } });
  }

  async update(id: number, input: UpdateOptionInput): Promise<Option> {
    const target_option = await this.findOne(id);

    if (target_option) {
      return await this.optionRepo.save({
        ...target_option,
        ...input,
      });
    }
  }

  async remove(id: number): Promise<number> {
    const result = await this.optionRepo.delete(id);
    return result.affected;
  }
}
