import CommonFunc from '../../utils/CommonFunc';
import api from '../api';
import { HoaDonDto, IHoaDonChiTietDto } from './dto';

class HoaDonService {
  CreateHoaDon = async (input: any): Promise<HoaDonDto | null> => {
    if (CommonFunc.checkNull_OrEmpty(input.idKhachHang)) {
      input.idKhachHang = null;
    }

    if (CommonFunc.checkNull_OrEmpty(input.idChiNhanh)) {
      input.idChiNhanh = null;
    }
    const result = await api.post('api/services/app/HoaDon/CreateHoaDon', input);
    return result;
  };
  InsertHoaDon = async (input: HoaDonDto): Promise<HoaDonDto | null> => {
    if (CommonFunc.checkNull_OrEmpty(input.idKhachHang)) {
      input.idKhachHang = null;
    }

    if (CommonFunc.checkNull_OrEmpty(input.idChiNhanh)) {
      input.idChiNhanh = null;
    }
    const result = await api.post(`api/services/app/HoaDon/InsertBH_HoaDon`, input);
    return result;
  };
  InsertHoaDonChiTiet = async (idHoaDon: string, input: IHoaDonChiTietDto[]): Promise<boolean> => {
    const result = await api.post(`api/services/app/HoaDon/InsertHoaDonChiTiet?idHoaDon=${idHoaDon}`, input);
    return result;
  };
}

export default new HoaDonService();
