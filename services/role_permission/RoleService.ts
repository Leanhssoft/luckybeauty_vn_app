import api from "../api";
import { IPagedRequestDto } from "../commonDto/IPagedRequestDto";
import { IPageResultDto } from "../commonDto/IPageResultDto";
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
  CreateOrUpdateRole = async (input: IRoleDto): Promise<boolean> => {
    const data = await api.get(
      `api/services/app/Role/CreateOrUpdateRole`,
      input
    );
    console.log("CreateOrUpdateRole ", data);
    return data?.status === "success";
  };
}

export default new RoleService();
