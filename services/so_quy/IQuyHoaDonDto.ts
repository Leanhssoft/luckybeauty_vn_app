import { IQuyChitietDto } from './IQuyChitietDto';

export interface IQuyHoaDonDto {
  id: string;
  idChiNhanh: string | null;
  idBrandname?: string;
  idNhanVien?: string | null;
  idLoaiChungTu: number;
  maHoaDon?: string;
  tongTienThu: number;
  ngayLapHoaDon: string;
  trangThai?: number;
  noiDungThu?: string;
  hachToanKinhDoanh?: boolean;
}
