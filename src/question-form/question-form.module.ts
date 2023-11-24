import { Module } from '@nestjs/common';
import { QuestionFormService } from './question-form.service';
import { QuestionFormResolver } from './question-form.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionInForm } from './entities/question-form.entity';
import { FormService } from 'src/form/form.service';
import { QuestionService } from 'src/question/question.service';
import { Form } from 'src/form/entities/form.entity';
import { Question } from 'src/question/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Question, QuestionInForm])],
  providers: [
    QuestionFormResolver,
    QuestionFormService,
    FormService,
    QuestionService,
  ],
})
export class QuestionFormModule {}
