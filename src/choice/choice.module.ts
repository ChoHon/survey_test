import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceResolver } from './choice.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from './entities/choice.entity';
import { QuestionFormModule } from 'src/question-form/question-form.module';
import { OptionModule } from 'src/option/option.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Choice]),
    QuestionFormModule,
    OptionModule,
  ],
  providers: [ChoiceResolver, ChoiceService],
  exports: [ChoiceService],
})
export class ChoiceModule {}
