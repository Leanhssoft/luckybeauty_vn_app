import Realm from 'realm';
const tblKhachHang: Realm.ObjectSchema = {
  name: 'idKhachHang',
  primaryKey: 'idKhachHang',
  properties: {
    idKhachHang: 'string',
    maKhachHang: 'string',
    tenKhachHang: 'string',
    soDienThoai: 'string',
    avatar: 'string?'
  }
};
export default tblKhachHang;
