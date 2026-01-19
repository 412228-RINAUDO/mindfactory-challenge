import { Expose } from 'class-transformer';
import { IsInt, IsBoolean, Min } from 'class-validator';

export class PaginationMetaDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  pageItems: number;

  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @Min(0)
  totalPages: number;

  constructor(page: number, pageItems: number, total: number) {
    this.page = page;
    this.pageItems = pageItems;
    this.total = total;
    this.totalPages = Math.ceil(total / pageItems);
  }
}
