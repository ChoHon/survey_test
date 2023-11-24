import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {}

  async create(input: CreateAnswerInput): Promise<Answer> {
    const new_answer = this.answerRepo.create(input);

    return await this.answerRepo.save(new_answer);
  }

  async findAll(): Promise<Answer[]> {
    return this.answerRepo.find();
  }

  async findOne(id: number): Promise<Answer> {
    return this.answerRepo.findOne({ where: { id } });
  }

  async update(id: number, input: UpdateAnswerInput): Promise<Answer> {
    const target_answer = await this.findOne(id);

    if (target_answer) {
      return await this.answerRepo.save({ ...target_answer, ...input });
    }
  }

  async remove(id: number): Promise<number> {
    const result = await this.answerRepo.delete(id);
    return result.affected;
  }
}
