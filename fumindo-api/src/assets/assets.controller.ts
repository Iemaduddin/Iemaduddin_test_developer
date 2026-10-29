import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AssetsService } from './assets.service.js';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto.js';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Get()
  findAll() { return this.assets.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.assets.findOne(id); }

  @Post()
  create(@Body() input: CreateAssetDto) { return this.assets.create(input); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() input: UpdateAssetDto) {
    return this.assets.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.assets.remove(id); }
}
