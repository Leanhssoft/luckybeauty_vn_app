import api from '../api';
import { IParamSearchFromToDto } from '../commonDto/IParamSearchFromToDto';
import { ICharDataDto, IThongKeSoLuongDto } from './dto';

class DashboardService {
  ThongKeSoLuong = async (input: IParamSearchFromToDto): Promise<IThongKeSoLuongDto | null> => {
    try {
      const xx = await api.post(`api/services/app/Dashboard/ThongKeSoLuong`, input);
      return xx;
    } catch (error) {
      return null;
    }
  };
  ThongKeDoanhThu = async (input: IParamSearchFromToDto): Promise<ICharDataDto[]> => {
    try {
      const xx = await api.post(`api/services/app/Dashboard/ThongKeDoanhThu`, input);
      return xx;
    } catch (error) {
      // todo test
      const dataTest: ICharDataDto[] = [
        { label: '01', value: 1 },
        { label: '02', value: 2 },
        { label: '03', value: 3 },
        { label: '04', value: 2 }
      ];
      return dataTest;
    }
  };
}

export default new DashboardService();
