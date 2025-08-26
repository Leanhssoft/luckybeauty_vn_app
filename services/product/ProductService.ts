import ApiConst from "@/const/ApiConst";
import CommonFunc from "@/utils/CommonFunc";
import api from "../api";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { IParamSearchProductDto, IProductBasic, ProductDto } from "./dto";

class ProductSevice {
  GetDetailProduct = async (idDonViQuyDoi: string): Promise<IProductBasic> => {
    const data = await api.get(
      `api/services/app/HangHoa/GetDetailProduct?idDonViQuyDoi=${idDonViQuyDoi}`
    );
    return data;
  };
  GetListproduct = async (
    input: IParamSearchProductDto
  ): Promise<IPageResultDto<IProductBasic>> => {
    const xx = await api.post(`api/services/app/HangHoa/GetDMHangHoa`, input);
    return xx;
  };
  GetInforBasic_OfListHangHoa_ByIdHangHoa = async (
    arrIdHangHoa: string[]
  ): Promise<IProductBasic[]> => {
    const xx = await api.post(
      `api/services/app/HangHoa/GetInforBasic_OfListHangHoa`,
      arrIdHangHoa
    );
    return xx;
  };
  GetInforBasic_OfListHangHoa_ByIdQuyDoi = async (
    arrIdQuyDoi: string[]
  ): Promise<IProductBasic[]> => {
    const xx = await api.post(
      `api/services/app/DonViQuiDoi/GetInforBasic_OfListHangHoa_ByIdQuyDoi`,
      arrIdQuyDoi
    );
    return xx;
  };
  CheckExistsMaHangHoa = async (
    maHangHoa: string,
    idDonViQuyDoi: string
  ): Promise<boolean> => {
    if (CommonFunc.checkNull(maHangHoa)) return false;
    if (CommonFunc.checkNull_OrEmpty(idDonViQuyDoi))
      idDonViQuyDoi = ApiConst.GUID_EMPTY;
    const data = await api.get(
      `api/services/app/HangHoa/CheckExistsMaHangHoa?mahanghoa=${maHangHoa}&id=${idDonViQuyDoi}`
    );
    return data;
  };
  CreateOrOEdit = async (input: ProductDto): Promise<ProductDto | null> => {
    const data = await api.post(`api/services/app/HangHoa/CreateOrEdit`, input);
    return data;
  };
  DeleteProduct = async (idHangHoa: string): Promise<ProductDto | null> => {
    if (CommonFunc.checkNull_OrEmpty(idHangHoa)) return null;
    const data = await api.post(
      `api/services/app/HangHoa/Delete?id=${idHangHoa}`
    );
    return data;
  };
  DeleteMultipleProduct = async (arrIdHangHoa: string[]): Promise<boolean> => {
    if (arrIdHangHoa?.length === 0) return false;
    await api.post(
      `api/services/app/HangHoa/DeleteMultipleProduct`,
      arrIdHangHoa
    );
    return true;
  };
}

export default new ProductSevice();
