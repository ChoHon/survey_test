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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB,
      synchronize: true,
      entities: [__dirname + '/**/entities/**.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error) => ({
        message: error.message,
        path: error.path,
        code: error.extensions.code,
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
