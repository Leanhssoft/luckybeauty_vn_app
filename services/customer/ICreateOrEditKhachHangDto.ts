import { ICustomerBasicDto } from "./ICustomerBasicDto";

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
  ngaySinh: Date | null;
  kieuNgaySinh?: number;
  idLoaiKhach?: number;
  idNhomKhach?: string;
  idNguonKhach?: string;
  idTinhThanh?: string;
  idQuanHuyen?: string;
  idKhachHangZOA?: string;
}

export class CreateOrEditKhachangDto implements ICreateOrEditKhachHangDto {
  id: string;
  idKhachHang: string | null;
  maKhachHang: string;
  tenKhachHang: string;
  soDienThoai: string;
  tenKhachHang_KhongDau?: string;
  diaChi?: string;
  gioiTinhNam?: boolean;
  email?: string;
  moTa?: string;
  trangThai?: number;
  tongTichDiem?: number;
  maSoThue?: string;
  avatar?: string;
  ngaySinh: Date | null;
  kieuNgaySinh?: number;
  idLoaiKhach?: number;
  idNhomKhach?: string;
  idNguonKhach?: string;
  idTinhThanh?: string;
  idQuanHuyen?: string;
  idKhachHangZOA?: string;
  constructor({
    id = "",
    maKhachHang = "",
    tenKhachHang = "",
    soDienThoai = "",
    gioiTinhNam = false,
    ngaySinh = null,
    diaChi = "",
    idNhomKhach = "",
  }) {
    this.id = id;
    this.idKhachHang = id;
    this.maKhachHang = maKhachHang;
    this.tenKhachHang = tenKhachHang;
    this.soDienThoai = soDienThoai;
    this.ngaySinh = ngaySinh;
    this.diaChi = diaChi;
    this.gioiTinhNam = gioiTinhNam;
    this.idNhomKhach = idNhomKhach;
  }
}
