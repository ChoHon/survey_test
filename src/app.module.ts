import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormModule } from './form/form.module';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';
import { QuestionFormModule } from './question-form/question-form.module';
import { ChoiceModule } from './choice/choice.module';
import { AnswerModule } from './answer/answer.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './config/wiston.config';
import { typeormConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(typeormConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error) => ({
        message: error.message,
        path: error.path,
      }),
    }),
    WinstonModule.forRoot(winstonLogger),
    FormModule,
    QuestionModule,
    QuestionFormModule,
    OptionModule,
    ChoiceModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
