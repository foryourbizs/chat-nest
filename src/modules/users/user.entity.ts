import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SocialProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
  KAKAO = 'kakao',
  NAVER = 'naver',
}

@Entity('users')
@Index('IDX_USER_EMAIL', ['email'])
@Index('IDX_USER_PROVIDER', ['provider'])
@Index('IDX_USER_EMAIL_PROVIDER', ['email', 'provider'])
@Index('IDX_USER_PROVIDER_ID', ['providerId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  password?: string;

  @Column({ type: 'enum', enum: SocialProvider, default: SocialProvider.LOCAL })
  provider: SocialProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  providerId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  refreshToken?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
