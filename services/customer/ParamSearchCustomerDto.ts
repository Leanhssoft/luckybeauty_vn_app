import { IParamSearchFromToDto } from "../commonDto/IParamSearchFromToDto";

export interface IParamSearchCustomerDto extends IParamSearchFromToDto {
  loaiDoiTuong: number;
  idNhomKhachs?: string[];
  idNguonKhachs?: string[];
  gioiTinh?: boolean | null;
  ngaySinhFrom?: string | null;
  ngaySinhTo?: string | null;
  creationTimeFrom?: string | null;
  creationTimeTo?: string | null;
  tongChiTieuTu?: number | null;
  tongChiTieuDen?: number | null;
  conNoFrom?: number | null;
  conNoTo?: number | null;
}
