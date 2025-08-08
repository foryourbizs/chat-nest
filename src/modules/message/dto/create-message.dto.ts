import { IsEnum, IsInt, IsJSON, IsOptional, IsString } from 'class-validator';
import { MessageRole } from '../message.entity';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageRole)
  role: MessageRole;

  @IsInt()
  conversationId: number;

  @IsOptional()
  @IsInt()
  tokenCount?: number;

  @IsOptional()
  @IsJSON()
  metadata?: object;
}
