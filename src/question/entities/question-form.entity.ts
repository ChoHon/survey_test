import { Choice } from 'src/answer/entities/choice.entity';
import { Form } from 'src/form/entities/form.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class QuestionInForm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.qf)
  question: Question;

  @ManyToOne(() => Form, (form) => form.qf)
  form: Form;

  @Column()
  question_number: number;

  @OneToMany(() => Choice, (choice) => choice.qf)
  choice: Choice;
}
