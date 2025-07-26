import { DiaryStatus } from '../../enum/DiaryStatus';
import { LoaiChungTu } from '../../enum/LoaiChungTu';
import api from '../api';
import { IQuyChitietDto } from './IQuyChitietDto';
import { IQuyHoaDonDto } from './IQuyHoaDonDto';
import CommonFunc from '../../utils/CommonFunc';

class SoQuyService {
  ShareMoney = ({
    phaiTT = 0,
    tienCoc = 0,
    tienDiem = 0,
    tienTheGiaTri = 0,
    tienMat = 0,
    tienChuyenKhoan = 0,
    tienPOS = 0
  }) => {
    if (tienCoc >= phaiTT) {
      return {
        TienCoc: phaiTT,
        TTBangDiem: 0,
        TienMat: 0,
        TienPOS: 0,
        TienChuyenKhoan: 0,
        TienTheGiaTri: 0
      };
    } else {
      phaiTT = phaiTT - tienCoc;
      if (tienDiem >= phaiTT) {
        return {
          TienCoc: tienCoc,
          TTBangDiem: phaiTT,
          TienMat: 0,
          TienPOS: 0,
          TienChuyenKhoan: 0,
          TienTheGiaTri: 0
        };
      } else {
        phaiTT = phaiTT - tienDiem;
        if (tienTheGiaTri >= phaiTT) {
          return {
            TienCoc: tienCoc,
            TTBangDiem: tienDiem,
            TienMat: 0,
            TienPOS: 0,
            TienChuyenKhoan: 0,
            TienTheGiaTri: Math.abs(phaiTT)
          };
        } else {
          phaiTT = phaiTT - tienTheGiaTri;
          if (tienMat >= phaiTT) {
            return {
              TienCoc: tienCoc,
              TTBangDiem: tienDiem,
              TienMat: Math.abs(phaiTT),
              TienPOS: 0,
              TienChuyenKhoan: 0,
              TienTheGiaTri: tienTheGiaTri
            };
          } else {
            phaiTT = phaiTT - tienMat;
            if (tienChuyenKhoan >= phaiTT) {
              return {
                TienCoc: tienCoc,
                TTBangDiem: tienDiem,
                TienMat: tienMat,
                TienPOS: 0,
                TienChuyenKhoan: Math.abs(phaiTT),
                TienTheGiaTri: tienTheGiaTri
              };
            } else {
              phaiTT = phaiTT - tienChuyenKhoan;
              if (tienPOS >= phaiTT) {
                return {
                  TienCoc: tienCoc,
                  TTBangDiem: tienDiem,
                  TienMat: tienMat,
                  TienPOS: Math.abs(phaiTT),
                  TienChuyenKhoan: tienChuyenKhoan,
                  TienTheGiaTri: tienTheGiaTri
                };
              } else {
                phaiTT = phaiTT - tienPOS;
                return {
                  TienCoc: tienCoc,
                  TTBangDiem: tienDiem,
                  TienMat: tienMat,
                  TienPOS: tienPOS,
                  TienChuyenKhoan: tienChuyenKhoan,
                  TienTheGiaTri: tienTheGiaTri
                };
              }
            }
          }
        }
      }
    }
  };
  CreateQuyHoaDon = async (input: IQuyHoaDonDto): Promise<IQuyHoaDonDto> => {
    const result = await api.post('api/services/app/QuyHoaDon/Create', input);
    return result;
  };
  InsertQuyHoaDon = async (input: IQuyHoaDonDto): Promise<IQuyHoaDonDto> => {
    const result = await api.post('api/services/app/QuyHoaDon/InsertQuyHoaDon', input);
    return result;
  };
  InsertQuyHoaDonChiTiet = async (idQuyHoaDon: string, input: IQuyChitietDto[]): Promise<boolean> => {
    const result = await api.post(
      `api/services/app/QuyHoaDon/InsertQuyHoaDonChiTiet?idQuyHoaDon=${idQuyHoaDon}`,
      input
    );
    return result;
  };
}

export default new SoQuyService();
