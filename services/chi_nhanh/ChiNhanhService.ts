import api from '../api';
import { IChiNhanhBasicDto } from './ChiNhanhDto';

class ChiNhanhService {
  GetChiNhanhByUser = async (): Promise<IChiNhanhBasicDto[]> => {
    const result = await api.get('api/services/app/ChiNhanh/GetChiNhanhByUser');
    return result;
  };
  GetForEdit = async (id: string): Promise<IChiNhanhBasicDto> => {
    const result = await api.get('api/services/app/ChiNhanh/GetForEdit?id' + id);
    return result;
  };
}
export default new ChiNhanhService();
