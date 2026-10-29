import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity.js';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto.js';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private readonly assets: Repository<Asset>) {}

  findAll() {
    return this.assets.find({ order: { asset_id: 'ASC' } });
  }

  async findOne(id: number) {
    const asset = await this.assets.findOneBy({ asset_id: id });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  create(input: CreateAssetDto) {
    return this.assets.save(this.assets.create(input));
  }

  async update(id: number, input: UpdateAssetDto) {
    const asset = await this.findOne(id);
    return this.assets.save(Object.assign(asset, input));
  }

  async remove(id: number) {
    const asset = await this.findOne(id);
    await this.assets.remove(asset);
    return { deleted: true };
  }
}
