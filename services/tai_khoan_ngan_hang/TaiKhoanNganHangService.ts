import ApiConst from '../../const/ApiConst';
import api from '../api';
import { ITaiKhoanNganHangDto } from './ITaiKhoanNganHangDto';

class TaiKhoanNganHangService {
  async GetAllBank() {
    const xx = await api.get(`api/services/app/NganHang/GetAll`);
    return xx;
  }
  async GetAllBankAccount_Where() {
    const xx = await api.get(`api/services/app/TaiKhoanNganHang/GetAll`);
    return xx;
  }
  async GetAllBankAccount(idChiNhanh = ApiConst.GUID_EMPTY): Promise<ITaiKhoanNganHangDto[]> {
    const xx = await api.get(`api/services/app/TaiKhoanNganHang/GetAllBankAccount?idChiNhanh=${idChiNhanh}`);
    return xx;
  }
  GetDefault_TaiKhoanNganHang = async (idChiNhanh = ApiConst.GUID_EMPTY): Promise<ITaiKhoanNganHangDto> => {
    const xx = await api.get(`api/services/app/TaiKhoanNganHang/GetDefault_TaiKhoanNganHang?idChiNhanh=${idChiNhanh}`);
    return xx;
  };
  GetBankAccount_byId = async (idTaiKhoanNganHang: string): Promise<ITaiKhoanNganHangDto | null> => {
    try {
      const xx = await api.get(
        `api/services/app/TaiKhoanNganHang/GetBankAccount_byId?idTaiKhoanNganHang=${idTaiKhoanNganHang}`
      );
      return xx;
    } catch (error) {
      return null;
    }
  };
  CreateOrEditBankAccount = async (params: any) => {
    const xx = await api.post(`api/services/app/TaiKhoanNganHang/CreateOrEdit`, params);
    return xx;
  };
  // GetQRCode = async (taiKhoanNganHang: ITaiKhoanNganHangDto, tongThanhToan = 0, tenKhachHang = '', maHoaDon = '') => {
  //     const result = await axios.post(
  //         'apis://api.vietqr.io/v2/generate',
  //         {
  //             accountNo: taiKhoanNganHang.soTaiKhoan,
  //             accountName: taiKhoanNganHang.tenChuThe,
  //             acqId: taiKhoanNganHang.maPinNganHang,
  //             addInfo: `${tenKhachHang} thanh toán hóa đơn ${maHoaDon}`,
  //             amount: tongThanhToan,
  //             template: 'qr_only'
  //         },
  //         {
  //             headers: {
  //                 'x-client-id': process.env.CLIENT_ID_VIET_QR,
  //                 'x-api-key': process.env.API_KEY_VIET_QR,
  //                 'Content-Type': 'application/json'
  //             }
  //         }
  //     );
  //     if (!utils.checkNull(result.data.data)) return result.data.data.qrDataURL;
  //     else {
  //         return '';
  //     }
  // };
}

export default new TaiKhoanNganHangService();
