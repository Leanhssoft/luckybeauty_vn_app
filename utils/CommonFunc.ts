import ApiConst from "../const/ApiConst";
import { IHoaDonDto } from "../services/hoadon/dto";

class CommonFunc {
  getMaxNumberFromMaHoaDon = (arr: IHoaDonDto[]): number => {
    if (!arr.length) return 1;
    const maxNumber = arr.reduce((max: number, item: IHoaDonDto) => {
      const match = item.maHoaDon.match(/\d+/); // Trích xuất số từ maHoaDon
      const number = match ? parseInt(match[0], 10) : 0; // Chuyển thành số nguyên
      return Math.max(max, number); // So sánh với max hiện tại
    }, 0);

    return maxNumber + 1; //  Cộng thêm 1 vào kết quả trả về
  };
  convertString_toEnglish = (word: string) => {
    if (!word) return "";
    let str = word.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/^\\-+|\\-+$/g, "");

    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    return str;
  };
  checkNull = (input: string | null | undefined) => {
    return (
      input === "null" ||
      input === null ||
      input === undefined ||
      input === "undefined" ||
      input.toString().replace(/\s+/g, "") === ""
    );
  };
  checkNull_OrEmpty = (input: string | null | undefined) => {
    return (
      input === "null" ||
      input === null ||
      input === undefined ||
      input === "undefined" ||
      input === ApiConst.GUID_EMPTY ||
      input.toString().replace(/\s+/g, "") === ""
    );
  };
  getFirstLetter = (str = "", maxLen = 2) => {
    const allLetter = str
      ?.match(/(?<=(\s|^))[a-z0-9]/gi)
      ?.join("")
      ?.toUpperCase();
    if (allLetter !== undefined) {
      if (allLetter.length >= maxLen) {
        return allLetter.substring(0, maxLen);
      } else {
        return allLetter;
      }
    }
    return "";
  };
  remove_LastComma = (str: string) => {
    if (str !== null && str !== undefined && str.length > 1) {
      return str.replace(/(^[,\s]+)|([,\s]+$)/g, "");
    } else {
      return "";
    }
  };
  formatNumberToFloat = (objVal: any) => {
    if (objVal === undefined || objVal === null) {
      return 0;
    } else {
      const value = parseFloat(
        objVal.toString().replaceAll(".", "").replace(",", ".")
      );
      if (isNaN(value)) {
        return 0;
      } else {
        return value;
      }
    }
  };
  formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };
}

export default new CommonFunc();
