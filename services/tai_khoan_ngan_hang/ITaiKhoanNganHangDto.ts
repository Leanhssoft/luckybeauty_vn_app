import { INganHangDto } from './INganHangDto';

export interface ITaiKhoanNganHangDto {
  id: string;
  idChiNhanh?: string;
  idNganHang: string;
  soTaiKhoan: string;
  tenChuThe: string;
  ghiChu?: string;
  trangThai?: number;
  isDefault?: boolean;

  logoNganHang?: string;
}
