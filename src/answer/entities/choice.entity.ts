import { Option } from 'src/option/entities/option.entity';
import { QuestionInForm } from 'src/question/entities/question-form.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestionInForm, (qf) => qf.choice)
  qf: QuestionInForm;

  @ManyToOne(() => Option, (option) => option.choice)
  option: Option;

  @ManyToOne(() => Answer, (answer) => answer.choice)
  answer: Answer;
}
