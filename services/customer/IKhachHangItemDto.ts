import { ICreateOrEditKhachHangDto } from './ICreateOrEditKhachHangDto';

export interface IKhachHangItemDto extends ICreateOrEditKhachHangDto {
  tenLoaiKhachHang?: string;
  tenNguonKhach?: string;
  tenNhomKhach?: string;
  soLanBooking?: number;
  soLanCheckIn?: number;
  tongChiTieu?: number;
  conNo?: number;
  cuocHenGanNhat?: Date;
}
