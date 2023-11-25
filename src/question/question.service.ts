import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  async createQuestion(input: CreateQuestionInput): Promise<Question> {
    const new_question = this.questionRepository.create(input);
    const result = await this.questionRepository.save(new_question);

    this.logger.log(`문항 생성 성공`, 'Question');
    return result;
  }

  async findAllQuestion(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findOneQuestion(id: number): Promise<Question> {
    return this.questionRepository.findOne({ where: { id } });
  }

  async updateQuestion(
    id: number,
    input: UpdateQuestionInput,
  ): Promise<Question> {
    const target_question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!target_question) {
      const msg = '존재하지 않는 문항 ID';
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    const result = await this.questionRepository.save({
      ...target_question,
      ...input,
    });

    this.logger.log(`문항 수정 성공`, 'Question');
    return result;
  }

  async removeQuestion(id: number) {
    const result = await this.questionRepository.delete(id);

    if (!result.affected) {
      const msg = '문항 삭제 실패';
      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }

    this.logger.log('문항 삭제 성공', 'Question');
    return result.affected;
  }
}
