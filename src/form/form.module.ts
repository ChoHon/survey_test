import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormResolver } from './form.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { QuestionService } from 'src/question/question.service';
import { Question } from 'src/question/entities/question.entity';
import { QuestionInForm } from 'src/question/entities/question-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Question, QuestionInForm])],
  providers: [FormResolver, FormService, QuestionService],
})
export class FormModule {}
