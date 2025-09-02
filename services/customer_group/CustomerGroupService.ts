import ApiConst from "@/const/ApiConst";
import CommonFunc from "@/utils/CommonFunc";
import api from "../api";
import { IPagedRequestDto } from "../commonDto/IPagedRequestDto";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { ICustomerGroupDto } from "./ICustomerGroupDto";

class CustomerGroupService {
  getAllNhomKhach = async (
    input: IPagedRequestDto
  ): Promise<IPageResultDto<ICustomerGroupDto>> => {
    try {
      const data = await api.get(
        `api/services/app/NhomKhach/getAll?Keyword=${
          input?.keyword ?? ""
        }&SkipCount=${input?.skipCount ?? 1}&MaxResultCount=${
          input?.maxResultCount ?? 10
        }`
      );
      return data;
    } catch (error) {
      console.log("error - getAllNhomKhach");
    }
    return {
      items: [],
      totalCount: 0,
      totalPage: 0,
    } as IPageResultDto<ICustomerGroupDto>;
  };
  CheckExistsNhomKhachHang = async (tenNhomKhach: string, id: string) => {
    if (CommonFunc.checkNull(id)) {
      id = ApiConst.GUID_EMPTY;
    }
    const result = await api.get(
      `api/services/app/NhomKhach/CheckExistsNhomKhachHang?tenNhomKhach=${tenNhomKhach}&id=${id}`
    );
    return result;
  };
  CreateOrEditNhomKhach = async (
    input: ICustomerGroupDto
  ): Promise<ICustomerGroupDto | null> => {
    try {
      const data = await api.post(
        `api/services/app/NhomKhach/CreateOrEditNhomKhach`,
        input
      );
      return data;
    } catch (error) {
      console.log(`CreateOrEditNhomKhach ${error}`);
      return null;
    }
  };
}

export default new CustomerGroupService();
