import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  asset_name: string;

  @IsInt()
  @Min(0)
  stock_quantity: number;

  @IsIn(['Consumable', 'Non-Consumable'])
  category: 'Consumable' | 'Non-Consumable';
}

export class UpdateAssetDto {
  @IsString()
  @IsNotEmpty()
  asset_name: string;

  @IsInt()
  @Min(0)
  stock_quantity: number;

  @IsIn(['Consumable', 'Non-Consumable'])
  category: 'Consumable' | 'Non-Consumable';
}
