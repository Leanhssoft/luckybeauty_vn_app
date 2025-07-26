import { IPagedRequestDto } from '../commonDto/IPagedRequestDto';

export interface IPagedKhachHangRequestDto extends IPagedRequestDto {
  loaiDoiTuong?: number;
  idNhomKhach?: string;
  timeFrom?: Date;
  timeTo?: Date;
  tongChiTieuTu?: number;
  tongChiTieuDen?: number;
  gioiTinh?: boolean;
  isUserZalo?: number;
}
