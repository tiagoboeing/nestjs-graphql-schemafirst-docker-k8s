import { CreateIntegrationInput } from './create-integration.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateIntegrationInput extends PartialType(CreateIntegrationInput) {
  id: number;
}
