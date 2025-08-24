import api from "../api";
import { IPagedRequestDto } from "../commonDto/IPagedRequestDto";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { IUserBasic } from "../user/IUserBasic";
import { IRoleDto } from "./IRoleDto";

class RoleService {
  GetRoleForEdit = async (roleId: number): Promise<IRoleDto | null> => {
    const data = await api.get(
      `api/services/app/Role/GetRoleForEdit?Id=${roleId}`
    );
    return data;
  };
  GetAll = async (
    input: IPagedRequestDto
  ): Promise<IPageResultDto<IRoleDto> | null> => {
    const data = await api.get(`api/services/app/Role/GetAll`, input);
    return data;
  };
  CreateOrUpdateRole = async (input: IRoleDto): Promise<IRoleDto | null> => {
    const data = await api.post(
      `api/services/app/Role/CreateOrUpdateRole`,
      input
    );
    return data;
  };
  GetListUser_byRole = async (roleId: number): Promise<IUserBasic> => {
    const data = await api.get(
      `api/services/app/Role/GetListUser_byRole?id=${roleId}`
    );
    return data;
  };
}

export default new RoleService();
