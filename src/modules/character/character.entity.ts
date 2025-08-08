import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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

@Entity('characters')
@Index('IDX_CHARACTER_USER', ['userId'])
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

  @Column({ name: 'user_id' })
  @IsInt()
  userId: number;

  @ManyToOne(() => User, (user) => user.characters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany('Conversation', 'character')
  conversations: any[];

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  usageCount: number; // How many times this character has been used in conversations

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
