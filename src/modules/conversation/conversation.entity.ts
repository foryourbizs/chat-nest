import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conversations')
@Index('IDX_CONVERSATION_CREATED', ['createdAt'])
@Index('IDX_CONVERSATION_CHARACTER', ['characterId'])
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string; // Auto-generated or user-defined title for the conversation

  @Column()
  @IsInt()
  characterId: number;

  @ManyToOne('Character', 'conversations', {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  character: any;

  @OneToMany('Message', 'conversation')
  messages: any[];

  @Column({ type: 'int', default: 0 })
  @IsOptional()
  messageCount: number; // Total messages in the conversation

  @Column({ type: 'int', default: 0 })
  @IsOptional()
  totalTokens: number; // Total tokens used in this conversation

  @Column({ type: 'boolean', default: true })
  @IsOptional()
  isActive: boolean; // For soft deletion

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
