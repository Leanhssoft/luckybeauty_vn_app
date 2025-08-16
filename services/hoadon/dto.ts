import dayjs from "dayjs";
import { InvoiceStatus } from "../../enum/InvoiceStatus";
import { LoaiChungTu } from "../../enum/LoaiChungTu";
import { ICustomerBasicDto } from "../customer/ICustomerBasicDto";
import { IProductBasic } from "../product/dto";

export interface IHoaDonDto extends ICustomerBasicDto {
  id: string;
  idLoaiChungTu: number;
  idChiNhanh: string | null;
  idKhachHang: string | null;
  idNhanVien: string | null;
  maHoaDon: string;
  ngayLapHoaDon: string;
  isOpenLastest: boolean;

  tongTienHangChuaChietKhau: number;
  ptChietKhauHang: number;
  tongChietKhauHangHoa: number;
  tongTienHang: number;
  ptThueHD: number;
  tongTienThue: number;
  tongTienHDSauVAT: number;
  ptGiamGiaHD: number;
  tongGiamGiaHD: number;
  chiPhiTraHang: number;
  tongThanhToan: number;
  chiPhiHD: number;
  ghiChuHD: string;
  trangThai: number;
}

export interface IHoaDonChiTietDto extends IProductBasic {
  id: string;
  idHoaDon: string;
  idChiTietHoaDon?: string | null;
  stt: number;
  soLuong: number;
  donGiaTruocCK: number;
  ptChietKhau?: number;
  tienChietKhau?: number;
  laPTChietKhau?: boolean;
  donGiaSauCK: number;
  thanhTienTruocCK: number;
  thanhTienSauCK: number;
  ptThue?: number;
  tienThue?: number;
  donGiaSauVAT: number;
  thanhTienSauVAT: number;
  ghiChu?: string;
  trangThai: number;
}

export class HoaDonDto implements IHoaDonDto {
  id: string;
  idLoaiChungTu: number;
  idKhachHang: string | null;
  idChiNhanh: string | null;
  idNhanVien: string | null;
  maHoaDon: string;
  ngayLapHoaDon: string;
  isOpenLastest: boolean;

  tongTienHangChuaChietKhau: number;
  ptChietKhauHang: number;
  tongChietKhauHangHoa: number;
  tongTienHang: number;
  ptThueHD: number;
  tongTienThue: number;
  tongTienHDSauVAT: number;
  ptGiamGiaHD: number;
  tongGiamGiaHD: number;
  chiPhiTraHang: number;
  tongThanhToan: number;
  chiPhiHD: number;
  ghiChuHD: string;
  trangThai: number;

  maKhachHang: string;
  tenKhachHang: string;
  soDienThoai: string;

  constructor({
    id = "",
    idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE,
    idChiNhanh = "",
    idKhachHang = null,
    idNhanVien = null,
    maHoaDon = "",
    ngayLapHoaDon = dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
    isOpenLastest = true,
    tongTienHangChuaChietKhau = 0,
    ptChietKhauHang = 0,
    tongChietKhauHangHoa = 0,
    tongTienHang = 0,
    ptThueHD = 0,
    tongTienThue = 0,
    tongTienHDSauVAT = 0,
    ptGiamGiaHD = 0,
    tongGiamGiaHD = 0,
    chiPhiTraHang = 0,
    tongThanhToan = 0,
    chiPhiHD = 0,
    ghiChuHD = "",
    trangThai = InvoiceStatus.HOAN_THANH,

    maKhachHang = "KL",
    tenKhachHang = "Khách lẻ",
    soDienThoai = "",
  }) {
    this.id = id;
    this.idLoaiChungTu = idLoaiChungTu;
    this.idChiNhanh = idChiNhanh;
    this.idKhachHang = idKhachHang;
    this.idNhanVien = idNhanVien;
    this.isOpenLastest = isOpenLastest;

    this.maHoaDon = maHoaDon;
    this.ngayLapHoaDon = ngayLapHoaDon;
    this.tongTienHangChuaChietKhau = tongTienHangChuaChietKhau;
    this.ptChietKhauHang = ptChietKhauHang;
    this.tongChietKhauHangHoa = tongChietKhauHangHoa;
    this.tongTienHang = tongTienHang;
    this.ptThueHD = ptThueHD;
    this.tongTienThue = tongTienThue;
    this.tongTienHDSauVAT = tongTienHDSauVAT;
    this.ptGiamGiaHD = ptGiamGiaHD;
    this.tongGiamGiaHD = tongGiamGiaHD;
    this.chiPhiTraHang = chiPhiTraHang;
    this.tongThanhToan = tongThanhToan;
    this.chiPhiHD = chiPhiHD;
    this.ghiChuHD = ghiChuHD;
    this.trangThai = trangThai;

    this.maKhachHang = maKhachHang;
    this.tenKhachHang = tenKhachHang;
    this.soDienThoai = soDienThoai;
  }
}
export class HoaDonChiTietDto implements IHoaDonChiTietDto {
  id: string;
  idHoaDon: string;
  idChiTietHoaDon?: string | null;
  stt: number;
  soLuong: number;
  donGiaTruocCK: number;
  ptChietKhau?: number;
  tienChietKhau?: number;
  laPTChietKhau?: boolean;
  donGiaSauCK: number;
  thanhTienTruocCK: number;
  thanhTienSauCK: number;
  ptThue?: number;
  tienThue?: number;
  donGiaSauVAT: number;
  thanhTienSauVAT: number;
  ghiChu?: string;
  trangThai: number;

  idDonViQuyDoi = "";
  idHangHoa = "";
  maHangHoa = "";
  tenHangHoa = "";
  giaBan = 0;

  constructor({
    id = "",
    idHoaDon = "",
    idChiTietHoaDon = null,
    stt = 1,
    soLuong = 0,
    ptChietKhau = 0,
    tienChietKhau = 0,
    laPTChietKhau = true,
    ptThue = 0,
    tienThue = 0,
    donGiaTruocCK = 0,
    donGiaSauCK = 0,
    donGiaSauVAT = 0,
    thanhTienTruocCK = 0,
    thanhTienSauCK = 0,
    thanhTienSauVAT = 0,
    ghiChu = "",
    trangThai = InvoiceStatus.HOAN_THANH,
    idDonViQuyDoi = "",
    idHangHoa = "",
    maHangHoa = "",
    tenHangHoa = "",
    giaBan = 0,
  }) {
    this.id = id;
    this.idHoaDon = idHoaDon;
    this.idChiTietHoaDon = idChiTietHoaDon;
    this.stt = stt;
    this.soLuong = soLuong;
    this.ptChietKhau = ptChietKhau;
    this.tienChietKhau = tienChietKhau;
    this.laPTChietKhau = laPTChietKhau;
    this.ptThue = ptThue;
    this.tienThue = tienThue;
    this.donGiaTruocCK = donGiaTruocCK;
    this.donGiaSauCK = donGiaSauCK;
    this.donGiaSauVAT = donGiaSauVAT;
    this.thanhTienTruocCK = thanhTienTruocCK;
    this.thanhTienSauCK = thanhTienSauCK;
    this.thanhTienSauVAT = thanhTienSauVAT;
    this.ghiChu = ghiChu;
    this.trangThai = trangThai;

    this.idDonViQuyDoi = idDonViQuyDoi;
    this.idHangHoa = idHangHoa;
    this.maHangHoa = maHangHoa;
    this.tenHangHoa = tenHangHoa;
    this.giaBan = giaBan;

    Object.defineProperties(this, {
      thanhTienTruocCK: {
        get() {
          if (this._thanhTienTruocCK === undefined) {
            return this.soLuong * this.donGiaTruocCK;
          }
          return this._thanhTienTruocCK;
        },
        set(value: number) {
          this._thanhTienTruocCK = value;
        },
      },
      donGiaSauCK: {
        get() {
          if (this.ptChietKhau ?? 0 > 0) {
            return (
              this.donGiaTruocCK -
              (this.donGiaTruocCK * (this.ptChietKhau ?? 0)) / 100
            );
          }
          return this.donGiaTruocCK - (this.tienChietKhau ?? 0);
        },
        // set(newVal: number) {
        //     return newVal;
        // }
      },
      // vừa có thể tự động tính toán
      // nhưng vẫn có thể thay đổi giá trị nếu được gán lại
      thanhTienSauCK: {
        get() {
          if (this._thanhTienSauCK === undefined) {
            return this.soLuong * this.donGiaSauCK;
          }
          return this._thanhTienSauCK;
        },
        set(value: number) {
          this._thanhTienSauCK = value;
        },
      },
      donGiaSauVAT: {
        get() {
          if (this.pTThue ?? 0 > 0) {
            return (
              this.donGiaSauCK + (this.donGiaSauCK * (this.pTThue ?? 0)) / 100
            );
          }
          return this.donGiaSauCK - (this.tienThue ?? 0);
        },
        // set(newVal: number) {
        //     return newVal;
        // }
      },
      thanhTienSauVAT: {
        get() {
          if (this._thanhTienSauVAT === undefined) {
            return this.soLuong * this.donGiaSauVAT;
          }
          return this._thanhTienSauVAT;
        },
        set(value: number) {
          this._thanhTienSauVAT = value;
        },
      },
    });
  }
}

export interface IHoaDonDto_FullInfor extends IHoaDonDto {
  daThanhToan?: number;
  conNo?: number;
}
