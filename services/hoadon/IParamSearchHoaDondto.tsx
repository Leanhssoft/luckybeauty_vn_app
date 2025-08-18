import { IParamSearchFromToDto } from "../commonDto/IParamSearchFromToDto";

export interface IParamSearchHoaDondto extends IParamSearchFromToDto {
  idLoaiChungTus?: number[];
  trangThais?: number[]; // 0.huy, 3.hoanthanh
  trangThaiNos?: number[]; // 1.conno, 0.hetno
}
