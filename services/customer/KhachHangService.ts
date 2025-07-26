import ApiConst from '../../const/ApiConst';
import CommonFunc from '../../utils/CommonFunc';
import api from '../api';
import { IFileDto } from '../commonDto/IFileDto';
import { IFileUploadDto } from '../commonDto/IFileUpload';
import { IPageResultDto } from '../commonDto/IPageResultDto';
import { ICreateOrEditKhachHangDto } from './ICreateOrEditKhachHangDto';
import { IKhachHangItemDto } from './IKhachHangItemDto';
import { IPagedKhachHangRequestDto } from './IPagedKhachHangRequestDto';

class KhachHangService {
  public async createOrEdit(input: ICreateOrEditKhachHangDto): Promise<ICreateOrEditKhachHangDto> {
    const result = await api.post('api/services/app/KhachHang/CreateOrEdit', input);
    return result.data.result;
  }
  public async getDetail(id: string): Promise<IKhachHangItemDto> {
    // full infor soLanCheckin, ngayCheckinGanNhat
    const response = await api.get(`api/services/app/KhachHang/GetKhachHangDetail?id=${id}`);
    return response;
  }
  // public async GetNhatKyHoatDong_ofKhachHang(id: string): Promise<HoatDongKhachHang[]> {
  //     const response = await api.get(`api/services/app/KhachHang/GetNhatKyHoatDong_ofKhachHang?idKhachHang=${id}`);
  //     return response.data.result;
  // }
  public async getKhachHang(id: string): Promise<ICreateOrEditKhachHangDto> {
    // get infor customer from DM_KhachHang
    if (CommonFunc.checkNull(id) || id === ApiConst.GUID_EMPTY) {
      return {
        id: '',
        maKhachHang: 'KL',
        tenKhachHang: 'Khách lẻ'
      } as ICreateOrEditKhachHangDto;
    }
    const result = await api.get(`api/services/app/KhachHang/GetKhachHang?id=${id}`);
    return result;
  }
  public async delete(id: string) {
    const result = await api.post(`api/services/app/KhachHang/Delete?id=${id}`);
    return result.data.result;
  }
  public async DeleteMultipleCustomer(lstId: any) {
    const result = await api.post(`api/services/app/KhachHang/DeleteMultipleCustomer`, lstId);
    return result.data.success; // true/false
  }
  ChuyenNhomKhachHang = async (lstIdKhachHang: any, idNhomKhachNew: string) => {
    const xx = await api.post(
      `api/services/app/KhachHang/ChuyenNhomKhachHang?idNhomKhach=${idNhomKhachNew}`,
      lstIdKhachHang
    );
    return xx.data.success;
  };
  public async exportDanhSach(input: IPagedKhachHangRequestDto): Promise<IFileDto> {
    const response = await api.post(`api/services/app/KhachHang/ExportDanhSach`, input);
    return response.data.result;
  }
  public async exportSelectedDanhSach(input: string[]): Promise<IFileDto> {
    const response = await api.post(`api/services/app/KhachHang/ExporSelectedtDanhSach`, input);
    return response.data.result;
  }
  jqAutoCustomer = async (input: IPagedKhachHangRequestDto): Promise<IKhachHangItemDto[]> => {
    const result = await api.post(`api/services/app/KhachHang/JqAutoCustomer`, input);
    return result;
  };
  async checkExistSoDienThoai(phone: string, id: string | null = null) {
    if (CommonFunc.checkNull(id)) {
      id = ApiConst.GUID_EMPTY;
    }
    const result = await api.get(`api/services/app/KhachHang/CheckExistSoDienThoai?phone=${phone}&id=${id}`);
    return result.data.result;
  }
  async GetKhachHang_noBooking(input: IPagedKhachHangRequestDto): Promise<IPageResultDto<IKhachHangItemDto>> {
    // tod: convert to POST
    const result = await api.post(`api/services/app/KhachHang/GetKhachHang_noBooking`, input);
    return result.data.result;
  }
  async checkData_FileImportKhachHang(input: IFileUploadDto) {
    const response = await api.post('api/services/app/KhachHang/CheckData_FileImportKhachHang', input);
    return response.data.result;
  }
  async importKhachHang(input: IFileUploadDto) {
    const response = await api.post('api/services/app/KhachHang/ImportDanhMucKhachHang', input);
    return response.data.result;
  }
  // async lichSuGiaoDich(idKhachHang: string, input: IPagedRequestDto): Promise<IPageResultDto<LichSuGiaoDich>> {
  //     const response = await api.post(`api/services/app/KhachHang/LichSuGiaoDich?idKhachHang=${idKhachHang}`, input);
  //     return response.data.result;
  // }
  // async lichSuDatLich(idKhachHang: string, input: IPagedRequestDto): Promise<IPageResultDto<ILichSuDatLich>> {
  //     const response = await api.post(`api/services/app/KhachHang/LichSuDatLich?idKhachHang=${idKhachHang}`, input);
  //     return response.data.result;
  // }
  GetListCustomerId_byPhone = async (memberPhone: string): Promise<string> => {
    const result = await api.get(`api/services/app/KhachHang/GetListCustomerId_byPhone?phone=${memberPhone}`);
    return result.data.result;
  };
}
export default new KhachHangService();
