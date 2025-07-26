import Realm from 'realm';

const tblHoaDonChiTiet: Realm.ObjectSchema = {
  name: 'tblHoaDonChiTiet',
  primaryKey: 'id',
  properties: {
    id: 'string',
    idHoaDon: 'string',
    stt: 'int',
    idDonViQuyDoi: 'string?',
    idHangHoa: 'string?',
    idChiTietHoaDon: 'string?',
    maHangHoa: 'string?',
    tenHangHoa: 'string?',
    soLuong: 'float',
    donGiaTruocCK: 'float',
    thanhTienTruocCK: 'float',
    laPTChietKhau: {
      type: 'int',
      default: 1
    },
    ptChietKhau: {
      type: 'float',
      default: 0
    },
    tienChietKhau: 'float',
    donGiaSauCK: 'float',
    thanhTienSauCK: 'float',
    ptThue: {
      type: 'float',
      default: 0
    },
    tienThue: {
      type: 'float',
      default: 0
    },
    donGiaSauVAT: 'float',
    thanhTienSauVAT: 'float',
    ghiChu: 'string?',
    trangThai: {
      type: 'int',
      default: 1
    }
  }
};

export default tblHoaDonChiTiet;
