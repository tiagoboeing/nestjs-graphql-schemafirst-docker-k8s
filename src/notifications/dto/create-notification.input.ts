import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateNotificationInput {
  @IsUUID()
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  message: string;
}
