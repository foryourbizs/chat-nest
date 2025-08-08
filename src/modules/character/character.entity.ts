import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('characters')
@Index('IDX_CHARACTER_NAME', ['name'])
export class Character extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string; // URL to character's avatar image

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  personality?: string; // Description of character's personality

  @Column({ type: 'text' })
  @IsString()
  systemPrompt: string; // Initial prompt for the AI model

  @OneToMany('Conversation', 'character')
  conversations: any[];

  @Column({ type: 'boolean', default: true })
  @IsOptional()
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number; // How many times this character has been used in conversations

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
