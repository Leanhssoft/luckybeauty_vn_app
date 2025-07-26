import api from '../api';
import { INhatKyThaoTacDto } from './INhatKyThaoTacDto';

class NhatKyThaoTacService {
  CreateNhatKyHoatDong = async (input: INhatKyThaoTacDto) => {
    const result = await api.post(`api/services/app/NhatKyThaoTac/CreateNhatKyHoatDong`, input);
    return result;
  };
}

export default new NhatKyThaoTacService();
