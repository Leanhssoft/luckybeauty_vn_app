export interface IQuyChitietDto {
  id: string;
  idQuyHoaDon: string;
  idHoaDonLienQuan?: string | null;
  idKhachHang?: string | null;
  idNhanVien?: string | null;
  idTaiKhoanNganHang?: string | null;
  idKhoanThuChi?: string | null;
  laPTChiPhiNganHang?: number;
  chiPhiNganHang?: number;
  thuPhiTienGui?: number;
  diemThanhToan?: number;
  hinhThucThanhToan: number;
  tienThu: number;

  tenChuThe?: string;
  soTaiKhoan?: string;
  tenNganHang?: string;
  tenKhoanThuChi?: string;
  sHinhThucThanhToan?: string;
  maHoaDonLienQuan?: string;
  maPinNganHang?: string;
}
