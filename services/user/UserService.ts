import api from "../api";
import { IUserDto } from "./IUserDto";

class UserService {
  getUser_byId = async (userId: number): Promise<IUserDto | null> => {
    try {
      const result = await api.get(`api/services/app/User/Get?Id=${userId}`);
      return result;
    } catch (error) {
      console.log(`getUser_byId ${error}`);
      return null;
    }
  };
  GetInforUser_ByUserName = async (
    userName: string
  ): Promise<IUserDto | null> => {
    try {
      const result = await api.get(
        `api/services/app/User/GetInforUser_ByUserName?userName=${userName}`
      );
      return result.data.result;
    } catch (error) {
      return {
        id: 1,
        userName: "admin",
      } as IUserDto;
    }
  };
  changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<IUserDto | null> => {
    try {
      const result = await api.post(
        `api/services/app/UserProfile/changeUserPassword`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );
      return result;
    } catch (error) {
      console.log(`changeUserPassword ${error}`);
      return null;
    }
  };
}
export default new UserService();
