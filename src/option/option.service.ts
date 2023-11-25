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
    const { question_id, ...rest } = input;
    const target_question =
      await this.questionService.findOneQuestion(question_id);

    if (!target_question) {
      const msg = '존재하지 않는 문항 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    const new_option = this.optionRepo.create(rest);
    new_option.question = target_question;

    const result = await this.optionRepo.save(new_option);

    this.logger.log('선택지 추가 성공', 'Option');
    return result;
  }

  async findAllOption(): Promise<Option[]> {
    return this.optionRepo.find();
  }

  async findOneOption(id: number): Promise<Option> {
    return this.optionRepo.findOne({ where: { id } });
  }

  async updateOption(id: number, input: UpdateOptionInput): Promise<Option> {
    const target_option = await this.findOneOption(id);
    if (!target_option) {
      const msg = '존재하지 않는 선택지 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    const result = await this.optionRepo.save({
      ...target_option,
      ...input,
    });

    this.logger.log('선택지 수정 성공', 'Option');
    return result;
  }

  async removeOption(id: number): Promise<number> {
    const result = await this.optionRepo.delete(id);

    if (!result.affected) {
      const msg = '선택지 삭제 실패';
      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }

    this.logger.log('선택지 삭제 성공', 'Option');
    return result.affected;
  }
}
