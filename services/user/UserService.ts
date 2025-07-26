import api from '../api';
import { IUserDto } from './IUserDto';

class UserService {
  getUser_byId = async (userId: number): Promise<IUserDto | null> => {
    try {
      const result = await api.get(`api/services/app/User/Get?Id=${userId}`);
      return result.data.result;
    } catch (error) {
      return null;
    }
  };
  GetInforUser_ByUserName = async (userName: string): Promise<IUserDto | null> => {
    try {
      const result = await api.get(`api/services/app/User/GetInforUser_ByUserName?userName=${userName}`);
      return result.data.result;
    } catch (error) {
      return {
        id: 1,
        userName: 'admin'
      } as IUserDto;
    }
  };
}
export default new UserService();
