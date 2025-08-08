import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '../../guards/admin.guard';
import { AdminCharacterController } from './admin/v1/character.controller';
import { CharacterController } from './api/v1/character.controller';
import { Character } from './character.entity';
import { CharacterService } from './character.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharacterController, AdminCharacterController],
  providers: [CharacterService, AdminGuard],
  exports: [CharacterService],
})
export class CharacterModule {}
