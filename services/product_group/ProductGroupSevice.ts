import api from '../api';
import { IProductGroupDto } from './dto';

class ProductGroupSevice {
  GetAllNhomHangHoa = async (): Promise<IProductGroupDto[]> => {
    const xx = await api.get(`api/services/app/HangHoa/GetNhomDichVu`);
    return xx;
  };
}
export default new ProductGroupSevice();
