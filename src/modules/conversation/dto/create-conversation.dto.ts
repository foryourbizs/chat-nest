import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsInt()
  userId: number;

  @IsInt()
  characterId: number;
}
