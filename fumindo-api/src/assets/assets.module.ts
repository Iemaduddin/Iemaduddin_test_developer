import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity.js';
import { AssetsController } from './assets.controller.js';
import { AssetsService } from './assets.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
