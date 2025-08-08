import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
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

// TypeORM 데코레이터에서 런타임에 필요하므로 type-only import 불가
import { User } from '../users/user.entity';

@Entity('conversations')
@Index('IDX_CONVERSATION_CREATED', ['createdAt'])
@Index('IDX_CONVERSATION_CHARACTER', ['characterId'])
@Index('IDX_CONVERSATION_USER', ['userId'])
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string; // Auto-generated or user-defined title for the conversation

  @Column({ name: 'user_id' })
  @IsInt()
  userId: number;

  @ManyToOne(() => User, (user) => user.conversations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'character_id' })
  @IsInt()
  characterId: number;

  @ManyToOne('Character', 'conversations', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'character_id' })
  character: any;

  @OneToMany('Message', 'conversation')
  messages: any[];

  @Column({ type: 'int', default: 0 })
  @IsInt()
  messageCount: number; // Total messages in the conversation

  @Column({ type: 'int', default: 0 })
  @IsInt()
  totalTokens: number; // Total tokens used in this conversation

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean; // For soft deletion

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
