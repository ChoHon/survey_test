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
    try {
      const new_question = this.questionRepository.create(input);
      const result = await this.questionRepository.save(new_question);

      this.logger.log(`문항 생성 성공`, 'Question');
      return result;
    } catch (error) {
      const msg = '문항 생성 실패';
      this.logger.error(msg, error.stack);
      throw new InternalServerErrorException(msg);
    }
  }

  async getAllQuestion(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getQuestionById(id: number): Promise<Question> {
    return this.questionRepository.findOne({ where: { id } });
  }

  async updateQuestion(
    id: number,
    input: UpdateQuestionInput,
  ): Promise<Question> {
    try {
      const target_question = await this.questionRepository.findOne({
        where: { id },
      });

      if (!target_question)
        throw new NotFoundException('존재하지 않는 문항 ID');

      const result = await this.questionRepository.save({
        ...target_question,
        ...input,
      });

      this.logger.log(`문항 수정 성공`, 'Question');
      return result;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async removeQuestion(id: number) {
    try {
      const result = await this.questionRepository.delete(id);

      if (!result.affected)
        throw new InternalServerErrorException('문항 삭제 실패');

      this.logger.log('문항 삭제 성공', 'Question');
      return result.affected;
    } catch (error) {
      this.logger.error(error.response.message, error.stack);
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
