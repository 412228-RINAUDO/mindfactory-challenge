import { IsOptional, IsPositive } from 'class-validator';
import { Expose } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  page?: number;

  @Expose({ name: 'page_items' })
  @IsOptional()
  @IsPositive()
  pageItems?: number;
}