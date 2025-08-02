import { InvoiceStatus } from "@/enum/InvoiceStatus";
import {
  HoaDonDto,
  IHoaDonChiTietDto,
  IHoaDonDto,
} from "@/services/hoadon/dto";
import * as sqlite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

class SQLLiteQuery {
  InitDatabase = async (db: SQLiteDatabase) => {
    try {
      const DATABASE_VERSION = 1;
      const result = await db.getFirstAsync<{
        user_version: number;
      }>("PRAGMA user_version");
      if (!result) {
        return;
      }
      let { user_version: currentDbVersion } = result;
      if (currentDbVersion >= DATABASE_VERSION) {
        return;
      }
      if (currentDbVersion === 0) {
        await db.execAsync(`PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tblHoaDon (id text PRIMARY KEY, idLoaiChungTu integer default 1,
        isOpenLastest int,
        maHoaDon text, ngayLapHoaDon text, idChiNhanh text, idKhachHang text, idNhanVien text,
        tongTienHangChuaChietKhau real,  ptChietKhauHang real default 0, 
        tongChietKhauHangHoa real, tongTienHang real, 
        ptThueHD real default 0, tongTienThue real default 0,
        tongTienHDSauVAT real, ptGiamGiaHD real, tongGiamGiaHD real, chiPhiTraHang real default 0, 
        tongThanhToan real, chiPhiHD real default 0, ghiChuHD text, trangThai integer default 3,
        maKhachHang text, tenKhachHang text, soDienThoai text);

       CREATE TABLE IF NOT EXISTS tblHoaDonChiTiet (id text PRIMARY KEY, idHoaDon text, stt integer, 
        idDonViQuyDoi text, idHangHoa text, idChiTietHoaDon text,
        maHangHoa text, tenHangHoa text,
        soLuong real,  donGiaTruocCK real, thanhTienTruocCK real,
        laPTChietKhau integer default 1,
        ptChietKhau real default 0, tienChietKhau real, donGiaSauCK real, thanhTienSauCK real,
        ptThue real default 0, tienThue real default 0, donGiaSauVAT real, thanhTienSauVAT real, 
        ghiChu text, trangThai integer default 1);
        
        `);
        currentDbVersion = 1;
      }
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    } catch (error) {
      console.log("InitDB_SQLLite ", error);
    }
  };
  InsertTo_HoaDon = async (db: sqlite.SQLiteDatabase, itemNew: HoaDonDto) => {
    try {
      await db.runAsync(
        `INSERT INTO tblHoaDon (id, idLoaiChungTu, idChiNhanh, idKhachHang, idNhanVien,
        maHoaDon, ngayLapHoaDon,
        tongTienHangChuaChietKhau, ptChietKhauHang, tongChietKhauHangHoa, tongTienHang,
        ptThueHD, tongTienThue, tongTienHDSauVAT, 
        ptGiamGiaHD, tongGiamGiaHD, chiPhiTraHang, tongThanhToan,chiPhiHD,
        ghiChuHD, trangThai,
        maKhachHang, tenKhachHang, soDienThoai)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        itemNew.id,
        itemNew?.idLoaiChungTu,
        itemNew?.idChiNhanh,
        itemNew?.idKhachHang,
        itemNew?.idNhanVien,
        itemNew?.maHoaDon,
        itemNew?.ngayLapHoaDon,
        itemNew?.tongTienHangChuaChietKhau,
        itemNew?.ptChietKhauHang,
        itemNew?.tongChietKhauHangHoa,
        itemNew?.tongTienHang ?? 0,
        itemNew?.ptThueHD ?? 0,
        itemNew?.tongTienThue ?? 0,
        itemNew?.tongTienHDSauVAT ?? 0,
        itemNew?.ptGiamGiaHD ?? 0,
        itemNew?.tongGiamGiaHD ?? 0,
        itemNew?.chiPhiTraHang ?? 0,
        itemNew?.tongThanhToan ?? 0,
        itemNew?.chiPhiHD ?? 0,
        itemNew?.ghiChuHD ?? 0,
        itemNew?.trangThai ?? InvoiceStatus.HOAN_THANH,
        itemNew?.maKhachHang,
        itemNew?.tenKhachHang,
        itemNew?.soDienThoai
      );
    } catch (error) {
      console.log("InsertTo_HoaDon ", error);
    }
  };
  UpdateHoaDon = async (db: sqlite.SQLiteDatabase, itemNew: IHoaDonDto) => {
    try {
      await db.runAsync(
        `UPDATE tblHoaDon 
        SET idLoaiChungTu = $idLoaiChungTu, 
          idKhachHang = $idKhachHang,  
          maHoaDon = $maHoaDon, 
          ngayLapHoaDon = $ngayLapHoaDon,
          tongTienHangChuaChietKhau = $tongTienHangChuaChietKhau, 
          ptChietKhauHang = $ptChietKhauHang, 
          tongChietKhauHangHoa = $tongChietKhauHangHoa, 
          tongTienHang = $tongTienHang, 
          ptThueHD = $ptThueHD, 
          tongTienThue = $tongTienThue, 
          tongTienHDSauVAT = $tongTienHDSauVAT, 
          ptGiamGiaHD = $ptGiamGiaHD, 
          tongGiamGiaHD = $tongGiamGiaHD, 
          chiPhiTraHang = $chiPhiTraHang, 
          tongThanhToan = $tongThanhToan, 
          chiPhiHD = $chiPhiHD, 
          ghiChuHD = $ghiChuHD, 
          trangThai = $trangThai
      WHERE id = '${itemNew.id}'`,
        {
          $idLoaiChungTu: itemNew?.idLoaiChungTu,
          $idKhachHang: itemNew?.idKhachHang,
          $maHoaDon: itemNew?.maHoaDon,
          $ngayLapHoaDon: itemNew?.ngayLapHoaDon,
          $tongTienHangChuaChietKhau: itemNew?.tongTienHangChuaChietKhau,
          $ptChietKhauHang: itemNew?.ptChietKhauHang,
          $tongChietKhauHangHoa: itemNew?.tongChietKhauHangHoa,
          $tongTienHang: itemNew?.tongTienHang,
          $ptThueHD: itemNew?.ptThueHD,
          $tongTienThue: itemNew?.tongTienThue,
          $tongTienHDSauVAT: itemNew?.tongTienHDSauVAT,
          $ptGiamGiaHD: itemNew?.ptGiamGiaHD,
          $tongGiamGiaHD: itemNew?.tongGiamGiaHD,
          $chiPhiTraHang: itemNew?.chiPhiTraHang,
          $tongThanhToan: itemNew?.tongThanhToan,
          $chiPhiHD: itemNew?.chiPhiHD,
          $ghiChuHD: itemNew?.ghiChuHD,
          $trangThai: itemNew?.trangThai,
        }
      );
    } catch (error) {
      console.log("UpdateTo_HoaDonChiTiet ", error);
    }
  };
  InsertTo_HoaDonChiTiet = async (
    db: sqlite.SQLiteDatabase,
    itemNew: IHoaDonChiTietDto
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO tblHoaDonChiTiet (id, idHoaDon, idDonViQuyDoi, idHangHoa,
        maHangHoa, tenHangHoa,
        stt, soLuong, donGiaTruocCK, thanhTienTruocCK,
        donGiaSauCK, thanhTienSauCK ,
        donGiaSauVAT, thanhTienSauVAT)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        itemNew.id,
        itemNew?.idHoaDon,
        itemNew?.idDonViQuyDoi,
        itemNew?.idDonViQuyDoi,
        itemNew?.maHangHoa,
        itemNew?.tenHangHoa,
        itemNew?.stt,
        itemNew?.soLuong,
        itemNew?.donGiaTruocCK,
        itemNew?.thanhTienTruocCK,
        itemNew?.donGiaSauCK ?? 0,
        itemNew?.thanhTienSauCK ?? 0,
        itemNew?.donGiaSauVAT ?? 0,
        itemNew?.thanhTienSauVAT ?? 0
      );
    } catch (error) {
      console.log("InsertTo_HoaDonChiTiet ", error);
    }
  };
  UpdateTo_HoaDonChiTiet = async (
    db: sqlite.SQLiteDatabase,
    itemNew: IHoaDonChiTietDto
  ) => {
    try {
      const thanhtien = (itemNew?.donGiaTruocCK ?? 0) * (itemNew?.soLuong ?? 0);
      await db.runAsync(
        `UPDATE tblHoaDonChiTiet SET soLuong = ?, thanhTienTruocCK = ?,  thanhTienSauCK = ?, thanhTienSauVAT = ?
      WHERE id = ?`,
        itemNew?.soLuong,
        thanhtien,
        thanhtien,
        thanhtien,
        itemNew?.id
      );
    } catch (error) {
      console.log("UpdateTo_HoaDonChiTiet ", error);
    }
  };
  UpdateHD_fromCTHD = async (db: sqlite.SQLiteDatabase, idHoaDon: string) => {
    try {
      const lst = await this.GetChiTietHoaDon_byIdHoaDon(db, idHoaDon);
      let tongTienHangChuaChietKhau = 0,
        tongChietKhauHang = 0,
        tongTienThue = 0;
      for (let index = 0; index < lst.length; index++) {
        const element = lst[index];
        tongTienHangChuaChietKhau += element.thanhTienTruocCK;
        tongChietKhauHang += element.soLuong * (element?.tienChietKhau ?? 0);
        tongTienThue += element.soLuong * (element?.tienThue ?? 0);
      }

      const hd = await this.GetHoaDon_byId(db, idHoaDon);
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

        await this.UpdateHoaDon(db, hd);
        return hd;
      }
    } catch (err) {
      console.log("UpdateHD_fromCTHD ", err);
    }

    return null;
  };
  UpdateKhachHang_toHoaDon = async (
    db: sqlite.SQLiteDatabase,
    idHoaDon: string,
    idKhachHang: string
  ) => {
    try {
      db.runAsync(
        `UPDATE tblHoaDon set idKhachHang= $idKhachHang where id=$id`,
        { $idKhacHang: idKhachHang, $id: idHoaDon }
      );
    } catch (error) {
      console.log("UpdateKhachHang_toHoaDon ", error);
    }
  };
  GetHoaDon_byId = async (db: sqlite.SQLiteDatabase, idHoaDon: string) => {
    try {
      const data = await db.getFirstAsync<IHoaDonDto>(
        `SELECT * FROM tblHoaDon where Id = '${idHoaDon}'`
      );
      return data;
    } catch (error) {
      console.log("GetHoaDon_byId ", error);
    }
    return null;
  };
  GetChiTietHoaDon_byIdHoaDon = async (
    db: sqlite.SQLiteDatabase,
    idHoaDon: string
  ): Promise<IHoaDonChiTietDto[]> => {
    try {
      const lst = await db.getAllAsync<IHoaDonChiTietDto>(
        `SELECT * FROM tblHoaDonChiTiet where IdHoaDon = '${idHoaDon}'`
      );
      return lst;
    } catch (error) {
      console.log("GetChiTietHoaDon_byIdHoaDon ", error);
    }
    return [];
  };
  GetChiTietHoaDon_byIdQuyDoi = async (
    db: sqlite.SQLiteDatabase,
    idHoaDonCurrent: string,
    idDonViQuyDoi: string
  ): Promise<IHoaDonChiTietDto | null> => {
    try {
      const lst = await db.getFirstAsync<IHoaDonChiTietDto>(
        `SELECT * FROM tblHoaDonChiTiet where IdHoaDon = $IdHoaDon and IdDonViQuyDoi = $IdDonViQuyDoi`,
        { $IdHoaDon: idHoaDonCurrent, $IdDonViQuyDoi: idDonViQuyDoi }
      );
      return lst;
    } catch (error) {
      console.log("GetChiTietHoaDon_byIdQuyDoi ", error);
    }
    return null;
  };
  GetListHoaDon_ByLoaiChungTu = async (
    db: sqlite.SQLiteDatabase,
    idLoaiChungTu: number
  ): Promise<IHoaDonDto[]> => {
    try {
      const lst = await db.getAllAsync<IHoaDonDto>(
        `SELECT * FROM tblHoaDon where IdLoaiChungTu = $IdLoaiChungTu`,
        { $IdLoaiChungTu: idLoaiChungTu }
      );
      return lst;
    } catch (error) {
      console.log("GetListHoaDon_ByLoaiChungTu ", error);
    }
    return [];
  };
  GetHoaDonOpenLastest = async (
    db: sqlite.SQLiteDatabase
  ): Promise<IHoaDonDto | null> => {
    try {
      const item = await db.getFirstAsync<IHoaDonDto>(
        `SELECT * FROM tblHoaDon where IsOpenLastest = 1`
      );
      return item;
    } catch (error) {
      console.log("GetHoaDonOpenLastest ", error);
    }
    return null;
  };
  HoaDon_ResetValueForColumn_isOpenLastest = async (
    db: sqlite.SQLiteDatabase,
    idLoaiChungTu: number
  ) => {
    try {
      await db.runAsync(
        `UPDATE tblHoaDon set isOpenLastest = 0 where IdLoaiChungTu =${idLoaiChungTu}`
      );
    } catch (error) {
      console.log("HoaDon_ResetValueForColumn_isOpenLastest ", error);
    }
  };
  RemoveHoaDon_byId = async (db: sqlite.SQLiteDatabase, id: string) => {
    await db.execAsync(`DELETE from tblHoaDon where Id='${id}';
      DELETE from tblHoaDonChiTiet where IdHoaDon='${id}'`);
  };
  DeleteHoaDonChiTiet_byId = async (db: sqlite.SQLiteDatabase, id: string) => {
    try {
      await db.runAsync(`DELETE from tblHoaDonChiTiet where id= $id`, {
        $id: id,
      });
    } catch (error) {
      console.log("DeleteHoaDonChiTiet_byIdQuyDoi ", error);
    }
  };
  DeleteHoaDonChiTiet_byIdQuyDoi = async (
    db: sqlite.SQLiteDatabase,
    idHoaDon: string,
    idDonViQuyDoi: string
  ) => {
    try {
      await db.runAsync(
        `DELETE from tblHoaDonChiTiet where idHoaDon= $idHoaDon and IdDonViQuyDoi = $IdDonViQuyDoi `,
        {
          $idHoaDon: idHoaDon,
          $IdDonViQuyDoi: idDonViQuyDoi,
        }
      );
    } catch (error) {
      console.log("DeleteHoaDonChiTiet_byIdQuyDoi ", error);
    }
  };
}

export default new SQLLiteQuery();
