import { IParamSearchDto } from './IParamSearchDto';

export interface IParamSearchFromToDto extends IParamSearchDto {
  fromDate?: string;
  toDate?: string;
  timeType?: number;
}
