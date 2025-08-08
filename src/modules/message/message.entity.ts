import { IsEnum, IsInt, IsJSON, IsOptional, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

@Entity('messages')
@Index('IDX_MESSAGE_CREATED', ['createdAt'])
@Index('IDX_MESSAGE_ROLE', ['role'])
@Index('IDX_MESSAGE_CONVERSATION', ['conversationId'])
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id: number;

  @Column({ type: 'text' })
  @IsString()
  content: string;

  @Column({ type: 'enum', enum: MessageRole })
  @IsEnum(MessageRole)
  role: MessageRole; // 'user', 'assistant', 'system'

  @Column({ name: 'conversation_id' })
  @IsInt()
  conversationId: number;

  @ManyToOne('Conversation', 'messages', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: any;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  tokenCount: number; // Tokens used for this specific message

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsJSON()
  metadata?: object; // e.g., AI model used, response time, etc.

  @CreateDateColumn()
  createdAt: Date;
}
