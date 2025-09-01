import ApiConst from "../../const/ApiConst";
import CommonFunc from "../../utils/CommonFunc";
import api from "../api";
import { INhatKyCuocHen } from "../appointment/INhatKyCuocHen";
import { IFileDto } from "../commonDto/IFileDto";
import { IFileUploadDto } from "../commonDto/IFileUpload";
import { IPagedRequestDto } from "../commonDto/IPagedRequestDto";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { ICreateOrEditKhachHangDto } from "./ICreateOrEditKhachHangDto";
import { IKhachHangItemDto } from "./IKhachHangItemDto";
import { ILichSuMuaHang } from "./ILichSuMuaHang";
import { ILuyKeTheGiaTri } from "./ILuyKeTheGiaTri";
import { IPagedKhachHangRequestDto } from "./IPagedKhachHangRequestDto";
import { IParamSearchCustomerDto } from "./ParamSearchCustomerDto";

class KhachHangService {
  public async createOrEdit(
    input: ICreateOrEditKhachHangDto
  ): Promise<ICreateOrEditKhachHangDto> {
    const result = await api.post(
      "api/services/app/KhachHang/CreateOrEdit",
      input
    );
    return result;
  }
  public async getDetail(id: string): Promise<IKhachHangItemDto> {
    // full infor soLanCheckin, ngayCheckinGanNhat
    const response = await api.get(
      `api/services/app/KhachHang/GetKhachHangDetail?id=${id}`
    );
    return response;
  }
  public async LichSuDatLich(
    idKhachHang: string,
    param: IPagedRequestDto
  ): Promise<IPageResultDto<INhatKyCuocHen>> {
    const response = await api.post(
      `api/services/app/KhachHang/LichSuDatLich?idKhachHang=${idKhachHang}`,
      param
    );
    return response;
  }
  public async LichSuMuaHang(
    idKhachHang: string,
    param: IPagedRequestDto
  ): Promise<IPageResultDto<ILichSuMuaHang>> {
    const response = await api.post(
      `api/services/app/KhachHang/LichSuGiaoDich?idKhachHang=${idKhachHang}`,
      param
    );
    return response;
  }
  public async getKhachHang(id: string): Promise<ICreateOrEditKhachHangDto> {
    // get infor customer from DM_KhachHang
    if (CommonFunc.checkNull(id) || id === ApiConst.GUID_EMPTY) {
      return {
        id: "",
        maKhachHang: "KL",
        tenKhachHang: "Khách lẻ",
      } as ICreateOrEditKhachHangDto;
    }
    const result = await api.get(
      `api/services/app/KhachHang/GetKhachHang?id=${id}`
    );
    return result;
  }
  public async getAll(
    input: IParamSearchCustomerDto
  ): Promise<IPageResultDto<IKhachHangItemDto>> {
    const result = await api.post(`api/services/app/KhachHang/Search`, input);
    return result;
  }
  public async delete(id: string) {
    const result = await api.post(`api/services/app/KhachHang/Delete?id=${id}`);
    return result;
  }
  public async DeleteMultipleCustomer(lstId: any) {
    const result = await api.post(
      `api/services/app/KhachHang/DeleteMultipleCustomer`,
      lstId
    );
    return result.data.success; // true/false
  }
  ChuyenNhomKhachHang = async (lstIdKhachHang: any, idNhomKhachNew: string) => {
    const xx = await api.post(
      `api/services/app/KhachHang/ChuyenNhomKhachHang?idNhomKhach=${idNhomKhachNew}`,
      lstIdKhachHang
    );
    return xx.data.success;
  };
  public async exportDanhSach(
    input: IPagedKhachHangRequestDto
  ): Promise<IFileDto> {
    const response = await api.post(
      `api/services/app/KhachHang/ExportDanhSach`,
      input
    );
    return response.data.result;
  }
  public async exportSelectedDanhSach(input: string[]): Promise<IFileDto> {
    const response = await api.post(
      `api/services/app/KhachHang/ExporSelectedtDanhSach`,
      input
    );
    return response.data.result;
  }
  jqAutoCustomer = async (
    input: IPagedKhachHangRequestDto
  ): Promise<IKhachHangItemDto[]> => {
    const result = await api.post(
      `api/services/app/KhachHang/JqAutoCustomer`,
      input
    );
    return result;
  };
  async checkExistSoDienThoai(phone: string, id: string | null = null) {
    if (CommonFunc.checkNull(id)) {
      id = ApiConst.GUID_EMPTY;
    }
    const result = await api.get(
      `api/services/app/KhachHang/CheckExistSoDienThoai?phone=${phone}&id=${id}`
    );
    return result;
  }
  async GetKhachHang_noBooking(
    input: IPagedKhachHangRequestDto
  ): Promise<IPageResultDto<IKhachHangItemDto>> {
    // tod: convert to POST
    const result = await api.post(
      `api/services/app/KhachHang/GetKhachHang_noBooking`,
      input
    );
    return result.data.result;
  }
  async checkData_FileImportKhachHang(input: IFileUploadDto) {
    const response = await api.post(
      "api/services/app/KhachHang/CheckData_FileImportKhachHang",
      input
    );
    return response.data.result;
  }
  async importKhachHang(input: IFileUploadDto) {
    const response = await api.post(
      "api/services/app/KhachHang/ImportDanhMucKhachHang",
      input
    );
    return response.data.result;
  }
  GetListCustomerId_byPhone = async (memberPhone: string): Promise<string> => {
    const result = await api.get(
      `api/services/app/KhachHang/GetListCustomerId_byPhone?phone=${memberPhone}`
    );
    return result.data.result;
  };
  GetListLuyKeTGT_ofKhachHang = async (
    idKhachHang: string
  ): Promise<ILuyKeTheGiaTri[]> => {
    const result = await api.get(
      `api/services/app/KhachHang/GetListLuyKeTGT_ofKhachHang?idKhachHang=${idKhachHang}`
    );
    return result;
  };
}
export default new KhachHangService();
