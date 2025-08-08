import { IsInt, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsInt()
  conversationId: number;
}
