import api from "../api";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { IPermissionDto } from "./IPermissionDto";

class PermissionService {
  GetAllPermissions =
    async (): Promise<IPageResultDto<IPermissionDto> | null> => {
      const data = await api.get(
        `api/services/app/Permission/GetAllPermissions`
      );
      return data;
    };
}

export default new PermissionService();
