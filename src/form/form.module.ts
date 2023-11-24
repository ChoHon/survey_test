import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormResolver } from './form.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  providers: [FormResolver, FormService],
  exports: [FormService],
})
export class FormModule {}
