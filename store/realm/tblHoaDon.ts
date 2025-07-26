import Realm from 'realm';
import { LoaiChungTu } from '../../enum/LoaiChungTu';
import { InvoiceStatus } from '../../enum/InvoiceStatus';
const tblHoaDon: Realm.ObjectSchema = {
  name: 'tblHoaDon',
  primaryKey: 'id',
  properties: {
    id: 'string',
    idLoaiChungTu: {
      type: 'int',
      default: LoaiChungTu.HOA_DON_BAN_LE
    },
    isOpenLastest: {
      type: 'bool',
      default: true
    },
    maHoaDon: 'string?',
    ngayLapHoaDon: 'string?',
    idChiNhanh: 'string?',
    idKhachHang: 'string?',
    idNhanVien: 'string?',
    tongTienHangChuaChietKhau: 'float',
    ptChietKhauHang: {
      type: 'float',
      default: 0
    },
    tongChietKhauHangHoa: 'float',
    tongTienHang: 'float',
    ptThueHD: {
      type: 'float',
      default: 0
    },
    tongTienThue: {
      type: 'float',
      default: 0
    },
    tongTienHDSauVAT: 'float',
    ptGiamGiaHD: 'float',
    tongGiamGiaHD: 'float',
    chiPhiTraHang: {
      type: 'float',
      default: 0
    },
    tongThanhToan: 'float',
    chiPhiHD: {
      type: 'float',
      default: 0
    },
    ghiChuHD: 'string?',
    trangThai: {
      type: 'int',
      default: InvoiceStatus.HOAN_THANH
    },
    maKhachHang: 'string?',
    tenKhachHang: 'string?',
    soDienThoai: 'string?'
  }
};
export default tblHoaDon;
