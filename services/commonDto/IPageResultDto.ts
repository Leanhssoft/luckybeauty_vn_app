export interface IPageResultDto<T> {
  totalCount: number;
  totalPage: number;
  items: T[];
}
