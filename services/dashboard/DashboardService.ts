import api from "../api";
import { IParamSearchFromToDto } from "../commonDto/IParamSearchFromToDto";
import { ICharDataDto, IThongKeSoLuongDto } from "./dto";

class DashboardService {
  ThongKeSoLuong = async (
    input: IParamSearchFromToDto
  ): Promise<IThongKeSoLuongDto | null> => {
    try {
      const xx = await api.post(
        `api/services/app/Dashboard/ThongKeSoLuong`,
        input
      );
      return xx;
    } catch (error) {
      return null;
    }
  };
  ThongKeDoanhThu = async (
    input: IParamSearchFromToDto
  ): Promise<ICharDataDto[]> => {
    try {
      const xx = await api.post(
        `api/services/app/Dashboard/ThongKeDoanhThu`,
        input
      );
      return xx;
    } catch (error) {
      return [];
    }
  };
  ThongKeLichHen = async (
    input: IParamSearchFromToDto
  ): Promise<ICharDataDto[]> => {
    try {
      const xx = await api.post(
        `api/services/app/Dashboard/ThongKeLichHen2`,
        input
      );
      return xx;
    } catch (error) {
      return [];
    }
  };
}

export default new DashboardService();
