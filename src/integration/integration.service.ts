import { Injectable } from '@nestjs/common';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { UpdateIntegrationInput } from './dto/update-integration.input';

@Injectable()
export class IntegrationService {
  create(createIntegrationInput: CreateIntegrationInput) {
    return {
      sat: '123',
      std: '123',
      status: '1 - Ok',
    };
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} integration`;
  }

  update(id: number, updateIntegrationInput: UpdateIntegrationInput) {
    return `This action updates a #${id} integration`;
  }

  remove(id: number) {
    return `This action removes a #${id} integration`;
  }
}
