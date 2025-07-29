import api from "../api";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { IProductGroupDto } from "./dto";

class ProductGroupSevice {
  GetAllNhomHangHoa = async (): Promise<IPageResultDto<IProductGroupDto>> => {
    const xx = await api.get(`api/services/app/NhomHangHoa/GetNhomDichVu`);
    return xx;
  };
}
export default new ProductGroupSevice();
