import { TenantStatus } from "../../enum/TenantStatus";
import { IAuthenResultModel, ILoginModel } from "./LoginDto";
// import { REACT_NATIVE_API_URL } from '@env';

const REACT_NATIVE_API_URL = "https://api.luckybeauty.vn/";

class LoginService {
  checkExistsTenant = async (tenantName: string) => {
    try {
      const param = {
        tenancyName: tenantName,
      };

      const response = await fetch(
        `${REACT_NATIVE_API_URL}/api/services/app/Account/IsTenantAvailable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(param),
        }
      );
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.log("checkExistsTenant ", error);
    }
    return {
      state: TenantStatus.NOTFOUND,
      tenantId: 0,
    };
  };
  checkUserLogin = async (
    input: ILoginModel,
    tennatId: number
  ): Promise<IAuthenResultModel | null> => {
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "Abp.TenantId",
        tennatId === 1 ? "null" : tennatId.toString()
      );
      myHeaders.append("Content-Type", "application/json");

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(input),
      };

      const response = await fetch(
        `${REACT_NATIVE_API_URL}api/TokenAuth/Authenticate`,
        requestOptions
      );
      const jsonData = await response.json();
      return jsonData.result;
    } catch (error) {
      console.log("checkUserLogin ", error);
    }
    return null;
  };
  GetLoginResult = async (input: ILoginModel, tennatId: number) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Abp.TenantId",
      tennatId == 1 ? "null" : tennatId.toString()
    );
    myHeaders.append("Content-Type", "application/json");
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(input),
    };
    const response = await fetch(
      `${REACT_NATIVE_API_URL}api/TokenAuth/GetLoginResult`,
      requestOptions
    );
    const jsonData = await response.json();
    return jsonData.result;
  };
}

export default new LoginService();
