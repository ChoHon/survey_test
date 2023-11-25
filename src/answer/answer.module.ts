import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { ChoiceModule } from 'src/choice/choice.module';
import { FormModule } from 'src/form/form.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), ChoiceModule, FormModule],
  providers: [AnswerResolver, AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
