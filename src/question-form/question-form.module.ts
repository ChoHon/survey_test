import { Module } from '@nestjs/common';
import { QuestionFormService } from './question-form.service';
import { QuestionFormResolver } from './question-form.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionInForm } from './entities/question-form.entity';
import { FormModule } from 'src/form/form.module';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionInForm]),
    FormModule,
    QuestionModule,
  ],
  providers: [QuestionFormResolver, QuestionFormService],
  exports: [QuestionFormService],
})
export class QuestionFormModule {}
