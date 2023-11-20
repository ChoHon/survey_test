import { Form } from 'src/form/entities/form.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class QuestionToForm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.questionToForm)
  question: Question;

  @ManyToOne(() => Form, (form) => form.questionToForm)
  form: Form;

  @Column()
  question_number: number;
}
