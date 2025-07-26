import Realm from 'realm';
import uuid from 'react-native-uuid';

import { HoaDonDto, IHoaDonChiTietDto, IHoaDonDto } from '../../services/hoadon/dto';
import realmDatabase from './database';
import { IProductBasic } from '../../services/product/dto';

enum ListTable {
  HOA_DON = 'tblHoaDon',
  HOA_DON_CHI_TIET = 'tblHoaDonChiTiet',
  HANG_HOA = 'tblHangHoa',
  KHACH_HANG = 'tblKhachHang'
}

const db = realmDatabase;

class realmQuery {
  Init_DanhMucHangHoa = () => {
    const arrProduct: IProductBasic[] = [
      {
        idHangHoa: '1',
        idDonViQuyDoi: '1',
        maHangHoa: 'HD001',
        tenHangHoa: 'Hoa hồng tươi',
        giaBan: 10000,
        tyLeChuyenDoi: 1,
        tenNhomHang: 'Hoa tươi'
      },
      {
        idHangHoa: '2',
        idDonViQuyDoi: '2',
        maHangHoa: 'HD002',
        tenHangHoa: 'Hoa cúc tươi',
        giaBan: 6000,
        tyLeChuyenDoi: 1,
        tenNhomHang: 'Hoa tươi'
      },
      {
        idHangHoa: '3',
        idDonViQuyDoi: '3',
        maHangHoa: 'HD003',
        tenHangHoa: 'Hoa ly',
        giaBan: 15000,
        tyLeChuyenDoi: 1,
        tenNhomHang: 'Hoa tươi'
      },
      {
        idHangHoa: '4',
        idDonViQuyDoi: '4',
        maHangHoa: 'HD003',
        tenHangHoa: 'Hoa cẩm chướng',
        giaBan: 9000,
        tyLeChuyenDoi: 1,
        tenNhomHang: 'Hoa tươi'
      }
    ];
    try {
      db.write(() => {
        arrProduct?.forEach(item => {
          db.create(ListTable.HANG_HOA, {
            idHangHoa: item.idHangHoa,
            idDonViQuyDoi: item.idDonViQuyDoi,
            maHangHoa: item.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            giaBan: item.giaBan,
            tyLeChuyenDoi: item.tyLeChuyenDoi,
            tenNhomHang: item.tenNhomHang
          });
        });
      });
    } catch (error) {
      console.log(`Init_DanhMucHangHoa ${error}`);
    }
  };
  GetHangHoa_byIdQuyDoi = (idQuyDoi: string): IProductBasic[] => {
    try {
      // realm có thể nhận mảng trực tiếp mà không cần chuyển thành chuỗi
      const lst = db
        .objects(ListTable.HANG_HOA)
        .filtered(`idDonViQuyDoi = $0`, idQuyDoi)
        .toJSON() as unknown as IProductBasic[];
      return lst;
    } catch (error) {
      console.log(`GetHangHoa_byIdQuyDoi ${error}`);
    }
    return [];
  };
  GetListHangHoa_byArrIdQuyDoi = (arrIdQuyDoi: string[]): IProductBasic[] => {
    try {
      // realm có thể nhận mảng trực tiếp mà không cần chuyển thành chuỗi
      const lst = db
        .objects(ListTable.HANG_HOA)
        .filtered(`idDonViQuyDoi in $0`, arrIdQuyDoi)
        .toJSON() as unknown as IProductBasic[];
      return lst;
    } catch (error) {
      console.log(`GetListHangHoa_byArrIdQuyDoi ${error}`);
    }
    return [];
  };
  GetListHangHoa_fromCacche = (): IProductBasic[] => {
    try {
      const lst = db.objects(ListTable.HANG_HOA).toJSON() as unknown as IProductBasic[];
      return lst;
    } catch (error) {
      console.log(`GetListHangHoa_fromCacche ${error}`);
    }
    return [];
  };
  GetListHoaDon_ByLoaiChungTu = (idLoaiChungTu: number): IHoaDonDto[] => {
    const lst = db
      .objects(ListTable.HOA_DON)
      .filtered(`idLoaiChungTu = $0`, idLoaiChungTu)
      .toJSON() as unknown as IHoaDonDto[];
    return lst;
  };

  GetHoaDon_byId = (id: string): IHoaDonDto | null => {
    try {
      const data = db.objectForPrimaryKey(ListTable.HOA_DON, id);
      if (data) {
        return data.toJSON() as unknown as IHoaDonDto;
      }
    } catch (err) {
      console.log('GetHoaDon_byId ', err);
    }

    return null;
  };
  GetHoaDonOpenLastest = (): IHoaDonDto | null => {
    try {
      const data = db.objects(ListTable.HOA_DON).filtered(`isOpenLastest = true`);
      if (data) {
        return data.toJSON() as unknown as IHoaDonDto;
      }
    } catch (err) {
      console.log('GetHoaDonOpenLastest ', err);
    }
    return null;
  };
  GetListChiTietHoaDon_byIdHoaDon = (idHoaDon: string): IHoaDonChiTietDto[] => {
    try {
      const lst = db
        .objects(ListTable.HOA_DON_CHI_TIET)
        .filtered(`idHoaDon= $0`, idHoaDon)
        .toJSON() as unknown as IHoaDonChiTietDto[];
      return lst;
    } catch (err) {
      console.log('GetListChiTietHoaDon_byIdHoaDon ', err);
    }
    return [];
  };
  GetChiTietHoaDon_byIdQuyDoi = (idHoaDon: string, idDonViQuyDoi: string): IHoaDonChiTietDto | null => {
    try {
      const data = db
        .objects(ListTable.HOA_DON_CHI_TIET)
        .filtered(`idHoaDon= $0 and idDonViQuyDoi= $1`, idHoaDon, idDonViQuyDoi)[0];
      if (data) {
        return data.toJSON() as unknown as IHoaDonChiTietDto;
      }
    } catch (err) {
      console.log('GetChiTietHoaDon_byIdQuyDoi ', err);
    }

    return null;
  };
  InsertTo_HoaDon = (itemNew: HoaDonDto) => {
    try {
      db.write(() => {
        db.create(ListTable.HOA_DON, {
          id: itemNew?.id,
          idLoaiChungTu: itemNew?.idLoaiChungTu,
          maHoaDon: itemNew?.maHoaDon,
          ngayLapHoaDon: itemNew?.ngayLapHoaDon,
          idChiNhanh: itemNew?.idChiNhanh,
          idKhachHang: itemNew?.idKhachHang,
          idNhanVien: itemNew?.idNhanVien,
          tongTienHangChuaChietKhau: itemNew?.tongTienHangChuaChietKhau,
          ptChietKhauHang: itemNew?.ptChietKhauHang,
          tongChietKhauHangHoa: itemNew?.tongChietKhauHangHoa,
          tongTienHang: itemNew?.tongTienHang,
          ptThueHD: itemNew?.ptThueHD,
          tongTienThue: itemNew?.tongTienThue,
          tongTienHDSauVAT: itemNew?.tongTienHDSauVAT,
          ptGiamGiaHD: itemNew?.ptGiamGiaHD,
          tongGiamGiaHD: itemNew?.tongGiamGiaHD,
          chiPhiTraHang: itemNew?.chiPhiTraHang,
          tongThanhToan: itemNew?.tongThanhToan,
          chiPhiHD: itemNew?.chiPhiHD,
          ghiChuHD: itemNew?.ghiChuHD,
          trangThai: itemNew?.trangThai,
          maKhachHang: itemNew?.maKhachHang,
          tenKhachHang: itemNew?.tenKhachHang,
          soDienThoai: itemNew?.soDienThoai
        });
      });
    } catch (err) {
      console.log('InsertTo_HoaDon ', err);
    }
  };
  InsertTo_HoaDonChiTiet = (itemNew: IHoaDonChiTietDto) => {
    try {
      db.write(() => {
        db.create(ListTable.HOA_DON_CHI_TIET, {
          id: itemNew?.id,
          idHoaDon: itemNew?.idHoaDon,
          stt: itemNew?.stt,
          idDonViQuyDoi: itemNew?.idDonViQuyDoi,
          idHangHoa: itemNew?.idHangHoa,
          idChiTietHoaDon: itemNew?.idChiTietHoaDon,
          maHangHoa: itemNew?.maHangHoa,
          tenHangHoa: itemNew?.tenHangHoa,
          soLuong: itemNew?.soLuong,
          donGiaTruocCK: itemNew?.donGiaTruocCK,
          thanhTienTruocCK: itemNew?.thanhTienTruocCK,
          laPTChietKhau: itemNew?.laPTChietKhau ? 1 : 0,
          ptChietKhau: itemNew?.ptChietKhau,
          tienChietKhau: itemNew?.tienChietKhau,
          donGiaSauCK: itemNew?.donGiaSauCK,
          thanhTienSauCK: itemNew?.thanhTienSauCK,
          ptThue: itemNew?.ptThue,
          tienThue: itemNew?.tienThue,
          donGiaSauVAT: itemNew?.donGiaSauVAT,
          thanhTienSauVAT: itemNew?.thanhTienSauVAT,
          ghiChu: itemNew?.ghiChu,
          trangThai: itemNew?.trangThai
        });
      });
    } catch (err) {
      console.log('InsertTo_HoaDonChiTiet ', err);
    }
  };
  UpdateTo_HoaDonChiTiet = (itemNew: IHoaDonChiTietDto) => {
    try {
      db.write(() => {
        const data = db.objectForPrimaryKey(ListTable.HOA_DON_CHI_TIET, itemNew?.id);
        if (data) {
          data.soLuong = itemNew?.soLuong;
          data.thanhTienTruocCK = itemNew?.thanhTienTruocCK;
          data.thanhTienSauCK = itemNew?.thanhTienSauCK;
          data.thanhTienSauVAT = itemNew?.thanhTienSauVAT;
        }
      });
    } catch (err) {
      console.log('UpdateTo_HoaDonChiTiet ', err);
    }
  };
  HoaDon_ResetValueForColumn_isOpenLastest = (idLoaiChungTu: number) => {
    db.write(() => {
      const lst = db.objects(ListTable.HOA_DON).filtered(`idLoaiChungTu= $0`, idLoaiChungTu);
      lst.forEach(item => {
        item.isOpenLastest = false;
      });
    });
  };
  UpdateHoaDon = (itemNew: HoaDonDto) => {
    try {
      db.write(() => {
        const data = db.objectForPrimaryKey(ListTable.HOA_DON, itemNew?.id);
        if (data) {
          (data.idLoaiChungTu = itemNew?.idLoaiChungTu),
            (data.idKhachHang = itemNew?.idKhachHang),
            (data.maHoaDon = itemNew?.maHoaDon),
            (data.ngayLapHoaDon = itemNew?.ngayLapHoaDon),
            (data.tongTienHangChuaChietKhau = itemNew?.tongTienHangChuaChietKhau),
            (data.ptChietKhauHang = itemNew?.ptChietKhauHang),
            (data.tongChietKhauHangHoa = itemNew?.tongChietKhauHangHoa),
            (data.tongTienHang = itemNew?.tongTienHang),
            (data.ptThueHD = itemNew?.ptThueHD),
            (data.tongTienThue = itemNew?.tongTienThue),
            (data.tongTienHDSauVAT = itemNew?.tongTienHDSauVAT),
            (data.ptGiamGiaHD = itemNew?.ptGiamGiaHD),
            (data.tongGiamGiaHD = itemNew?.tongGiamGiaHD),
            (data.chiPhiTraHang = itemNew?.chiPhiTraHang),
            (data.tongThanhToan = itemNew?.tongThanhToan),
            (data.chiPhiHD = itemNew?.chiPhiHD),
            (data.ghiChuHD = itemNew?.ghiChuHD),
            (data.trangThai = itemNew?.trangThai);
        }
      });
    } catch (err) {
      console.log('UpdateHoaDon ', err);
    }
  };
  UpdateKhachHang_toHoaDon = (idHoaDon: string, idKhachHang: string) => {
    db.write(() => {
      const data = db.objectForPrimaryKey(ListTable.HOA_DON, idHoaDon);
      if (data) {
        data.idKhachHang = idKhachHang;
      }
    });
  };
  UpdateHD_fromCTHD = (idHoaDon: string): IHoaDonDto | null => {
    try {
      const lst = this.GetListChiTietHoaDon_byIdHoaDon(idHoaDon);
      let tongTienHangChuaChietKhau = 0,
        tongChietKhauHang = 0,
        tongTienThue = 0;
      for (let index = 0; index < lst.length; index++) {
        const element = lst[index];
        tongTienHangChuaChietKhau += element.thanhTienTruocCK;
        tongChietKhauHang += element.soLuong * (element?.tienChietKhau ?? 0);
        tongTienThue += element.soLuong * (element?.tienThue ?? 0);
      }

      const hd = this.GetHoaDon_byId(idHoaDon);
      if (hd != null) {
        const sumThanhTienSauCK = tongTienHangChuaChietKhau - tongChietKhauHang;
        hd.tongTienHangChuaChietKhau = tongTienHangChuaChietKhau;
        hd.tongChietKhauHangHoa = tongChietKhauHang;
        hd.tongTienHang = sumThanhTienSauCK;
        hd.tongTienThue = tongTienThue;
        hd.tongTienHDSauVAT = sumThanhTienSauCK - tongTienThue;

        const ptGiamGiaHD = sumThanhTienSauCK > 0 ? hd?.ptGiamGiaHD ?? 0 : 0;
        let tongGiamHD = sumThanhTienSauCK > 0 ? hd?.tongGiamGiaHD ?? 0 : 0;
        if (hd?.ptGiamGiaHD > 0) {
          tongGiamHD = (ptGiamGiaHD * hd.tongTienHDSauVAT) / 100;
        }
        hd.tongThanhToan = hd.tongTienHDSauVAT - tongGiamHD;

        this.UpdateHoaDon(hd);
        return hd;
      }
    } catch (err) {
      console.log('UpdateHD_fromCTHD ', err);
    }

    return null;
  };
  RemoveHoaDon_byId = (id: string) => {
    try {
      db.write(() => {
        const data = db.objectForPrimaryKey(ListTable.HOA_DON, id);
        if (data) {
          db.delete(data);
        }
      });
    } catch (err) {
      console.log('RemoveHoaDon_byId ', err);
    }
  };
  DeleteHoaDonChiTiet_byIdHoaDon = (idHoaDon: string) => {
    try {
      db.write(() => {
        const lst = db.objects(ListTable.HOA_DON_CHI_TIET).filtered(`idHoaDon= $0 `, idHoaDon);
        db.delete(lst);
      });
    } catch (err) {
      console.log('DeleteHoaDonChiTiet_byId ', err);
    }
  };
  DeleteHoaDonChiTiet_byId = (id: string) => {
    try {
      db.write(() => {
        const data = db.objectForPrimaryKey(ListTable.HOA_DON_CHI_TIET, id);
        if (data) {
          db.delete(data);
        }
      });
    } catch (err) {
      console.log('DeleteHoaDonChiTiet_byId ', err);
    }
  };
  DeleteHoaDonChiTiet_byIdQuyDoi = (idHoaDon: string, idDonViQuyDoi: string) => {
    try {
      db.write(() => {
        const lst = db
          .objects(ListTable.HOA_DON_CHI_TIET)
          .filtered(`idHoaDon= $0 and idDonViQuyDoi =  $1`, idHoaDon, idDonViQuyDoi);
        db.delete(lst);
      });
    } catch (err) {
      console.log('DeleteHoaDonChiTiet_byIdQuyDoi ', err);
    }
  };
}

export default new realmQuery();
