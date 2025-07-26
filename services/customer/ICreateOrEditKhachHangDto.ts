import { ICustomerBasicDto } from './ICustomerBasicDto';

export interface ICreateOrEditKhachHangDto extends ICustomerBasicDto {
  id: string;
  tenKhachHang_KhongDau?: string;
  diaChi?: string;
  gioiTinhNam?: boolean;
  email?: string;
  moTa?: string;
  trangThai?: number;
  tongTichDiem?: number;
  maSoThue?: string;
  avatar?: string;
  ngaySinh?: Date;
  kieuNgaySinh?: number;
  idLoaiKhach?: number;
  idNhomKhach?: string;
  idNguonKhach?: string;
  idTinhThanh?: string;
  idQuanHuyen?: string;
  idKhachHangZOA?: string;
}
