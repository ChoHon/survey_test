import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OptionService } from 'src/option/option.service';
import { QuestionFormService } from 'src/question-form/question-form.service';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateChoiceInput } from './dto/create-choice.input';
import { Choice } from './entities/choice.entity';

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(Choice)
    private choiceRepo: Repository<Choice>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,

    private qfService: QuestionFormService,
    private optionService: OptionService,
  ) {}

  async createChoice(input: CreateChoiceInput): Promise<Choice> {
    try {
      const { qf_id, option_id } = input;
      const target_qf = await this.qfService.findOneById(qf_id);
      const target_option = await this.optionService.findOneOption(option_id);
      if (!target_qf || !target_option)
        throw new NotFoundException('존재하지 않는 설문지 문항 혹은 선택지 ID');

      const new_choice = this.choiceRepo.create();
      new_choice.qf = target_qf;
      new_choice.option = target_option;

      const result = await this.choiceRepo.save(new_choice);
      this.logger.log('Choice 생성 성공', 'Choice');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async findAllChoice(): Promise<Choice[]> {
    return this.choiceRepo.find();
  }

  async findOneChoice(id: number): Promise<Choice> {
    return this.choiceRepo.findOne({ where: { id } });
  }

  async removeChoice(id: number): Promise<number> {
    try {
      const result = await this.choiceRepo.delete(id);

      if (!result.affected)
        throw new InternalServerErrorException('Choice 삭제 실패');

      this.logger.log('Choice 삭제 성공', 'Choice');
      return result.affected;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
