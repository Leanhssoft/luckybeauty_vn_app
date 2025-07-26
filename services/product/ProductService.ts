import api from '../api';
import { IPageResultDto } from '../commonDto/IPageResultDto';
import { IParamSearchProductDto, IProductBasic } from './dto';

class ProductSevice {
  GetListproduct = async (input: IParamSearchProductDto): Promise<IPageResultDto<IProductBasic>> => {
    const xx = await api.post(`api/services/app/HangHoa/GetDMHangHoa`, input);
    return xx;
  };
  GetInforBasic_OfListHangHoa_ByIdHangHoa = async (arrIdHangHoa: string[]): Promise<IProductBasic[]> => {
    const xx = await api.post(`api/services/app/HangHoa/GetInforBasic_OfListHangHoa`, arrIdHangHoa);
    return xx;
  };
  GetInforBasic_OfListHangHoa_ByIdQuyDoi = async (arrIdQuyDoi: string[]): Promise<IProductBasic[]> => {
    const xx = await api.post(`api/services/app/DonViQuiDoi/GetInforBasic_OfListHangHoa_ByIdQuyDoi`, arrIdQuyDoi);
    return xx;
  };
}

export default new ProductSevice();
