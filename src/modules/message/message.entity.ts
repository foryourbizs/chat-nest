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
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole; // 'user', 'assistant', 'system'

  @Column()
  conversationId: number;

  @ManyToOne('Conversation', 'messages', {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  conversation: any;

  @Column({ type: 'int', default: 0 })
  tokenCount: number; // Tokens used for this specific message

  @Column({ type: 'json', nullable: true })
  metadata?: object; // e.g., AI model used, response time, etc.

  @CreateDateColumn()
  createdAt: Date;
}
