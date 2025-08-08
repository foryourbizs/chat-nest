import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  personality?: string;

  @IsString()
  systemPrompt: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // 기본값: true

  @IsOptional()
  @IsInt()
  usageCount?: number; // 기본값: 0
}
