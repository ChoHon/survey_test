import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateOptionInput } from './dto/create-option.input';
import { UpdateOptionInput } from './dto/update-option.input';
import { Option } from './entities/option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private optionRepo: Repository<Option>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,

    private questionService: QuestionService,
  ) {}

  async createOption(input: CreateOptionInput): Promise<Option> {
    try {
      const { question_id, ...rest } = input;
      const target_question =
        await this.questionService.getQuestionById(question_id);
      if (!target_question)
        throw new NotFoundException('존재하지 않는 문항 ID');

      const new_option = this.optionRepo.create(rest);
      new_option.question = target_question;

      const result = await this.optionRepo.save(new_option);

      this.logger.log('선택지 추가 성공', 'Option');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async getAllOption(): Promise<Option[]> {
    return this.optionRepo.find();
  }

  async getOptionById(id: number): Promise<Option> {
    return this.optionRepo.findOne({ where: { id } });
  }

  async updateOption(id: number, input: UpdateOptionInput): Promise<Option> {
    try {
      const target_option = await this.getOptionById(id);
      if (!target_option)
        throw new NotFoundException('존재하지 않는 선택지 ID');

      const result = await this.optionRepo.save({
        ...target_option,
        ...input,
      });

      this.logger.log('선택지 수정 성공', 'Option');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async removeOption(id: number): Promise<number> {
    try {
      const result = await this.optionRepo.delete(id);

      if (!result.affected)
        throw new InternalServerErrorException('선택지 삭제 실패');

      this.logger.log('선택지 삭제 성공', 'Option');
      return result.affected;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
