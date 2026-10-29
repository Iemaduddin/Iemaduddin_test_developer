import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type AssetCategory = 'Consumable' | 'Non-Consumable';

@Entity({ name: 'asset' })
export class Asset {
  @PrimaryGeneratedColumn({ name: 'asset_id' })
  asset_id: number;

  @Column({ name: 'asset_name', type: 'varchar', length: 255 })
  asset_name: string;

  @Column({ name: 'stock_quantity', type: 'integer' })
  stock_quantity: number;

  @Column({ type: 'varchar', length: 20 })
  category: AssetCategory;
}
