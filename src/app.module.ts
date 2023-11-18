import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  Injectable,
  Logger,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Form } from './form/entities/form.entity';
import { FormModule } from './form/form.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`${method} ${statusCode} - ${originalUrl} - ${ip}`);
    });
    next();
  }
}

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
      entities: [Form],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
