import Realm from 'realm';
import tblHoaDon from './tblHoaDon';
import tblHoaDonChiTiet from './tblHoaDonChiTiet';
import tblHangHoa from './tblHangHoa';
const realmDatabase = new Realm({
  schema: [tblHoaDon, tblHoaDonChiTiet, tblHangHoa],
  schemaVersion: 1
  // onMigration: (oldRealm, newRealm) => {
  //   // if(oldRealm.schemaVersion < 3){

  //   // }
  // },
});
export default realmDatabase;
