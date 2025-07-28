import ListProductSale from "@/components/_list_product_sale";
import { ActionBottom } from "@/components/action_bottom";
import { InvoiceStatus } from "@/enum/InvoiceStatus";
import { LoaiChungTu, TenLoaiChungTu } from "@/enum/LoaiChungTu";
import { SaleManagerTab } from "@/enum/navigation/RouteName";
import { SaleManagerTabParamList } from "@/enum/navigation/RouteParam";
import {
  HoaDonChiTietDto,
  HoaDonDto,
  IHoaDonChiTietDto,
} from "@/services/hoadon/dto";
import { IProductBasic } from "@/services/product/dto";
import ProductService from "@/services/product/ProductService";
import SQLLiteQuery from "@/store/expo-sqlite/SQLLiteQuery";
import { useSaleManagerStackContext } from "@/store/react_context/SaleManagerStackProvide";
import CommonFunc from "@/utils/CommonFunc";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import uuid from "react-native-uuid";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalAddGioHang from "../../../../components/ban_hang/modal_add_gio_hang";

type ProductSaleNavigationProps = NativeStackNavigationProp<
  SaleManagerTabParamList,
  SaleManagerTab.PRODUCT
>;

type ProductSaleRouteProp = RouteProp<
  SaleManagerTabParamList,
  SaleManagerTab.PRODUCT
>;

const Product = () => {
  const db = useSQLiteContext();
  const firstLoad = useRef(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const route = useRoute<ProductSaleRouteProp>();
  const navigation = useNavigation<ProductSaleNavigationProps>();
  const { currentInvoice, setCurrentInvoice, setIsHideTab } =
    useSaleManagerStackContext();
  const idHoaDonCurrent = currentInvoice?.idHoaDon ?? "";
  const idLoaiChungTu =
    currentInvoice?.idLoaiChungTu ?? LoaiChungTu.HOA_DON_BAN_LE;

  const [idHoaDonChosing, setIdHoaDonChosing] = useState("");
  const [isShowModalAddGioHang, setIsShowModalAddGioHang] = useState(false);
  const [isCheckMultipleProduct, setIsCheckMultipleProduct] = useState(false);
  const [isDoneAgreeChoseProduct, setIsDoneAgreeChoseProduct] = useState(false);
  const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>(
    {} as IHoaDonChiTietDto
  );

  useEffect(() => {
    if (setIsHideTab !== undefined) {
      setIsHideTab(isCheckMultipleProduct);
    }
  }, [isCheckMultipleProduct, setIsHideTab]);

  const PageLoad = async () => {};

  useEffect(() => {
    PageLoad();
  }, []);

  useEffect(() => {
    getInforHoaDon();
  }, [idHoaDonCurrent]);

  const getInforHoaDon = async () => {
    let idHoaDonChosing = null;

    if (!CommonFunc.checkNull_OrEmpty(idHoaDonCurrent)) {
      const itemHD = await SQLLiteQuery.GetHoaDon_byId(db, idHoaDonCurrent);
      if (itemHD !== null) {
        idHoaDonChosing = itemHD?.id;
      }
    } else {
      // get hdOpenLast
      const hdOpenLast = await SQLLiteQuery.GetHoaDonOpenLastest(db);
      if (hdOpenLast !== null) {
        idHoaDonChosing = hdOpenLast?.id;
      }
    }
    if (idHoaDonChosing) {
      setIdHoaDonChosing(idHoaDonChosing);
      const lstCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(
        db,
        idHoaDonChosing
      );
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: idHoaDonChosing,
        countProduct: lstCTHD?.length ?? 0,
      });
    } else {
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: "",
        countProduct: 0,
      });
    }
  };

  const GetIdHoaDon_andCreateNewHD_ifNotExist = async (): Promise<string> => {
    let idHoaDon = "";
    let existHD = false;
    if (CommonFunc.checkNull_OrEmpty(idHoaDonChosing)) {
      idHoaDon = uuid.v4();
    } else {
      const hd = await SQLLiteQuery.GetHoaDon_byId(db, idHoaDonChosing);
      if (hd === null) {
        idHoaDon = idHoaDonChosing;
      } else {
        idHoaDon = idHoaDonChosing;
        existHD = true;
      }
    }

    if (!existHD) {
      await SQLLiteQuery.HoaDon_ResetValueForColumn_isOpenLastest(
        db,
        idLoaiChungTu
      );

      const lstHoaDon = await SQLLiteQuery.GetListHoaDon_ByLoaiChungTu(
        db,
        idLoaiChungTu
      );

      const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
      const kiHieuMaChungTu =
        idLoaiChungTu == LoaiChungTu.HOA_DON_BAN_LE
          ? TenLoaiChungTu.HOA_DON_BAN_LE
          : TenLoaiChungTu.GOI_DICH_VU;

      const newHD = new HoaDonDto({
        id: idHoaDon,
        idLoaiChungTu: idLoaiChungTu,
        maHoaDon: `${kiHieuMaChungTu} ${max}`,
      });
      await SQLLiteQuery.InsertTo_HoaDon(db, newHD);
    }

    setIdHoaDonChosing(idHoaDon);

    return idHoaDon;
  };

  const choseProduct = async (
    arrIdQuyDoi: string[],
    isCheckMultipleProduct?: boolean
  ) => {
    setIsCheckMultipleProduct(isCheckMultipleProduct ?? false);
    if (isCheckMultipleProduct) {
      setArrIdQuyDoiChosed(arrIdQuyDoi);
      return;
    }
    const arrProduct: IProductBasic[] =
      await ProductService.GetInforBasic_OfListHangHoa_ByIdQuyDoi(arrIdQuyDoi);

    for (let i = 0; i < arrProduct?.length; i++) {
      const productItem = arrProduct[i];
      const idQuyDoi = arrProduct[i].idDonViQuyDoi;
      const itemCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdQuyDoi(
        db,
        idHoaDonCurrent,
        idQuyDoi
      );
      if (itemCTHD != null) {
        setCTDoing({
          ...ctDoing,
          id: itemCTHD?.id,
          stt: itemCTHD?.stt ?? 1,
          idHoaDon: idHoaDonChosing,
          idDonViQuyDoi: idQuyDoi,
          idHangHoa: productItem.idHangHoa,
          maHangHoa: productItem?.maHangHoa ?? "",
          tenHangHoa: productItem?.tenHangHoa ?? "",
          soLuong: itemCTHD.soLuong,
          donGiaTruocCK: itemCTHD?.donGiaTruocCK ?? 0,
          ptChietKhau: itemCTHD?.ptChietKhau ?? 0,
          tienChietKhau: itemCTHD?.tienChietKhau ?? 0,
          ptThue: itemCTHD?.ptThue ?? 0,
          tienThue: itemCTHD?.tienThue ?? 0,
          donGiaSauCK: itemCTHD?.donGiaSauCK ?? 0,
          thanhTienTruocCK: itemCTHD?.thanhTienTruocCK ?? 0,
          thanhTienSauCK: itemCTHD?.thanhTienSauCK ?? 0,
          thanhTienSauVAT: itemCTHD?.thanhTienSauVAT ?? 0,
        });
      } else {
        setCTDoing({
          ...ctDoing,
          stt: 1,
          id: uuid.v4(),
          idHoaDon: idHoaDonChosing,
          maHangHoa: productItem?.maHangHoa ?? "",
          tenHangHoa: productItem?.tenHangHoa ?? "",
          idDonViQuyDoi: idQuyDoi,
          idHangHoa: productItem.idHangHoa,
          soLuong: 1,
          ptChietKhau: 0,
          tienChietKhau: 0,
          laPTChietKhau: true,
          ptThue: 0,
          tienThue: 0,
          donGiaTruocCK: productItem?.giaBan ?? 0,
          thanhTienTruocCK: productItem?.giaBan ?? 0,
          donGiaSauCK: productItem?.giaBan ?? 0,
          thanhTienSauCK: productItem?.giaBan ?? 0,
          donGiaSauVAT: productItem?.giaBan ?? 0,
          thanhTienSauVAT: productItem?.giaBan ?? 0,
          trangThai: InvoiceStatus.HOAN_THANH,
        });
      }
      setIsShowModalAddGioHang(true);
    }
  };

  const Push_CTHD = async (
    arrProduct: IProductBasic[],
    cthd: IHoaDonChiTietDto[]
  ) => {
    for (let i = 0; i < arrProduct?.length; i++) {
      const itemFor = arrProduct[i];
      const newCTHD = new HoaDonChiTietDto({
        id: uuid.v4(),
        idHoaDon: idHoaDonCurrent,
        idDonViQuyDoi: itemFor?.idDonViQuyDoi,
        idHangHoa: itemFor?.idHangHoa,
        maHangHoa: itemFor?.maHangHoa,
        tenHangHoa: itemFor?.tenHangHoa,
        giaBan: itemFor?.giaBan ?? 0,
        soLuong: 1,
        donGiaTruocCK: itemFor?.giaBan ?? 0,
      });
      cthd.push(newCTHD);
      await SQLLiteQuery.InsertTo_HoaDonChiTiet(db, newCTHD);
    }
    return cthd;
  };
  const addMultipleProduct = async () => {
    setIsCheckMultipleProduct(false);
    setArrIdQuyDoiChosed([]);
    setIsDoneAgreeChoseProduct(true);

    let cthd = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(
      db,
      idHoaDonCurrent
    );
    const arrIdQuyDoiOld = cthd?.map((x) => {
      return x.idDonViQuyDoi;
    });
    const arrIdQuyDoiNew = arrIdQuyDoiChosed?.filter(
      (x) => !arrIdQuyDoiOld.includes(x)
    );
    const arrIdSame = arrIdQuyDoiChosed?.filter((x) =>
      arrIdQuyDoiOld.includes(x)
    );

    // if exists: increments quantity
    for (let i = 0; i < arrIdSame.length; i++) {
      const idQuyDoi = arrIdSame[i];
      for (let j = 0; j < cthd.length; j++) {
        const itemCTHD = cthd[j];
        if (itemCTHD.idDonViQuyDoi === idQuyDoi) {
          itemCTHD.soLuong += 1;
          itemCTHD.thanhTienTruocCK = itemCTHD.donGiaTruocCK * itemCTHD.soLuong;
          itemCTHD.thanhTienSauCK = itemCTHD.donGiaSauCK * itemCTHD.soLuong;
          itemCTHD.thanhTienSauVAT = itemCTHD.donGiaSauVAT * itemCTHD.soLuong;

          await SQLLiteQuery.UpdateTo_HoaDonChiTiet(db, itemCTHD);
          break;
        }
      }
    }

    // add new (from DB)
    const arrIdQuyDoi_fromDB = arrIdQuyDoiNew?.filter((x) => x.length > 1);
    const arrProduct: IProductBasic[] =
      await ProductService.GetInforBasic_OfListHangHoa_ByIdQuyDoi(
        arrIdQuyDoi_fromDB
      );
    cthd = await Push_CTHD(arrProduct, cthd);

    await SQLLiteQuery.UpdateHD_fromCTHD(db, idHoaDonCurrent);

    setCurrentInvoice({
      ...currentInvoice,
      countProduct:
        (currentInvoice?.countProduct ?? 0) + (arrIdQuyDoiNew?.length ?? 0),
    });
  };

  const agreeAddGioHang = async (ctAfter: IHoaDonChiTietDto) => {
    setIsShowModalAddGioHang(false);

    let idHoaDon = await GetIdHoaDon_andCreateNewHD_ifNotExist();
    // delete & add again
    const idQuyDoi = ctAfter?.idDonViQuyDoi;
    ctAfter.idHoaDon = idHoaDon;
    await SQLLiteQuery.DeleteHoaDonChiTiet_byIdQuyDoi(db, idHoaDon, idQuyDoi);
    await SQLLiteQuery.InsertTo_HoaDonChiTiet(db, ctAfter);

    const lstCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(
      db,
      idHoaDon
    );
    const hdAfter = await SQLLiteQuery.UpdateHD_fromCTHD(db, idHoaDon);
    if (hdAfter) {
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: idHoaDon,
        countProduct: lstCTHD?.length ?? 0,
      });
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ModalAddGioHang
        isShow={isShowModalAddGioHang}
        objUpdate={ctDoing}
        onClose={() => setIsShowModalAddGioHang(false)}
        onSave={agreeAddGioHang}
      />

      <ListProductSale
        isLoadData={true}
        isDoneAgreeChoseProduct={isDoneAgreeChoseProduct}
        onClickChoseProduct={choseProduct}
      />

      {isCheckMultipleProduct && (
        <ActionBottom
          visible={isCheckMultipleProduct}
          enable={arrIdQuyDoiChosed?.length > 0}
          onPress={addMultipleProduct}
        />
      )}
    </View>
  );
};
export default Product;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      position: "relative",
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    boxContainer: {
      justifyContent: "space-between",
      padding: 10,
    },
    textRightIcon: {
      paddingLeft: 8,
    },
    actionMenu: {
      backgroundColor: theme.colors.primary,
      gap: 8,
      padding: 10,
      position: "absolute",
      bottom: 0,
      width: "100%",
      justifyContent: "center",
    },
  });
