import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(input: CreateQuestionInput): Promise<Question> {
    const new_question = this.questionRepository.create(input);

    return await this.questionRepository.save(new_question);
  }

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findOne(id: number): Promise<Question> {
    return this.questionRepository.findOne({ where: { id } });
  }

  async update(id: number, input: UpdateQuestionInput): Promise<Question> {
    const target_question = await this.questionRepository.findOne({
      where: { id },
    });

    if (target_question) {
      return await this.questionRepository.save({
        ...target_question,
        ...input,
      });
    }
  }

  async remove(id: number) {
    const result = await this.questionRepository.delete(id);
    return result.affected;
  }
}
