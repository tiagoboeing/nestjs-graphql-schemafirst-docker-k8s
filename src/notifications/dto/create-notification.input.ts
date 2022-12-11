import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationInput {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
