import ApiConst from "@/const/ApiConst";
import { IParamSearchDto } from "../commonDto/IParamSearchDto";

export interface IDonViQuyDoiDto {
  id: string;
  maHangHoa: string;
  tenDonViTinh: string;
  tyLeChuyenDoi: number;
  giaBan: string | number;
  giaVon: string | number;
  laDonViTinhChuan: number;
}

export interface IProductBasic {
  idHangHoa: string;
  idDonViQuyDoi: string;
  idNhomHangHoa?: string | null;
  maHangHoa: string;
  tenHangHoa: string;
  giaBan: number;
  tyLeChuyenDoi?: number;
  tenNhomHang?: string;
}
export interface IParamSearchProductDto extends IParamSearchDto {
  idNhomHangHoas?: string[];
}

export class ProductDto implements IProductBasic {
  id: string;
  idHangHoa: string;
  idDonViQuyDoi: string;
  idNhomHangHoa: string | null;
  maHangHoa: string;
  tenHangHoa: string;
  tenHangHoa_KhongDau?: string;
  giaBan: number;
  giaVon?: number;
  tyLeChuyenDoi?: number;
  tenNhomHang?: string;
  donViQuiDois?: IDonViQuyDoiDto[];

  constructor({
    id = ApiConst.GUID_EMPTY,
    idHangHoa = ApiConst.GUID_EMPTY,
    idDonViQuyDoi = ApiConst.GUID_EMPTY,
    idNhomHangHoa = null,
    maHangHoa = "",
    tenHangHoa = "",
    giaBan = 0,
  }) {
    this.id = id;
    this.idHangHoa = idHangHoa;
    this.idDonViQuyDoi = idDonViQuyDoi;
    this.idNhomHangHoa = idNhomHangHoa;
    this.maHangHoa = maHangHoa;
    this.tenHangHoa = tenHangHoa;
    this.giaBan = giaBan;
  }
}
