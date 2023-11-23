import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Form } from 'src/form/entities/form.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Choice } from './choice.entity';

@Entity()
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => Form, (form) => form.answer)
  form: Form;

  @OneToMany(() => Choice, (choice) => choice.answer)
  choice: Choice[];

  @Column()
  @Field(() => Int)
  total_score: number;
}
