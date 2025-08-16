import { IParamSearchFromToDto } from "../commonDto/IParamSearchFromToDto";

export interface IParamSearchHoaDondto extends IParamSearchFromToDto {
  idLoaiChungTu?: number;
  trangThais?: number[]; // 0.huy, 3.hoanthanh
  trangThaiNos?: number[]; // 1.conno, 0.hetno
}
