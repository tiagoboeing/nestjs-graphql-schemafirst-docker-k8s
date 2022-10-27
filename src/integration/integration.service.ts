import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map, tap } from 'rxjs';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { UpdateIntegrationInput } from './dto/update-integration.input';

@Injectable()
export class IntegrationService {
  constructor(private readonly httpService: HttpService) {}

  async create(createIntegrationInput: CreateIntegrationInput): Promise<any> {
    return this.httpService
      .get<any>('http://172.24.240.1:8080/integration')
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error.response.data);
          throw 'An error happened!';
        }),
      );
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
