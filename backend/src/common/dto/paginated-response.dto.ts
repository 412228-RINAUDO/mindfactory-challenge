import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationMetaDto } from './pagination-meta.dto';

interface PaginationData {
  page: number;
  pageItems: number;
  total: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  constructor(data: T[], paginationData: PaginationData) {
    this.data = data;
    this.meta = new PaginationMetaDto(
      paginationData.page,
      paginationData.pageItems,
      paginationData.total,
    );
  }
}
