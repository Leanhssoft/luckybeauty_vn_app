import { Button, Icon, Input, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import uuid from "react-native-uuid";

import { ModalListProduct } from "@/components/ban_hang/modal_list_product";
import ModalListCustomer from "@/components/customer/modal_list_customer";
import { SimpleDialog } from "@/components/simple_dialog";
import { IconType } from "@/enum/IconType";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import KhachHangService from "@/services/customer/KhachHangService";
import {
  HoaDonChiTietDto,
  IHoaDonChiTietDto,
  IHoaDonDto,
} from "@/services/hoadon/dto";
import { IProductBasic } from "@/services/product/dto";
import ProductService from "@/services/product/ProductService";
import SQLLiteQuery from "@/store/expo-sqlite/SQLLiteQuery";
import { useSaleManagerStackContext } from "@/store/react_context/SaleManagerStackProvide";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { useNavigation, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function TempInvoiceDetails() {
  const { theme } = useTheme();
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const route = useRouter();
  const navigation = useNavigation();
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();
  const idHoaDon = currentInvoice?.idHoaDon ?? "";

  const [txtSearchProduct, setTxtSearchProduct] = useState("");
  const [isShowModalCustomer, setIsShowModalCustomer] = useState(false);
  const [isShowModalAddProduct, setIsShowModalAddProduct] = useState(false);
  const [lstCTHD, setLstCTHD] = useState<IHoaDonChiTietDto[]>([]);
  const [hoadonOpen, setHoaDonOpen] = useState<IHoaDonDto>({
    id: "",
  } as IHoaDonDto);

  const [custonerChosing, setCustonerChosing] = useState<IKhachHangItemDto>();
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();

  useEffect(() => {
    GetDataHoaDon_fromCache(idHoaDon);
  }, [idHoaDon]);

  const lstSearchCTHD = lstCTHD?.filter(
    (x) =>
      CommonFunc.convertString_toEnglish(x.tenHangHoa).indexOf(
        CommonFunc.convertString_toEnglish(txtSearchProduct)
      ) > -1
  );

  const GetDataHoaDon_fromCache = async (idHoaDon: string) => {
    const hd = await SQLLiteQuery.GetHoaDon_byId(db, idHoaDon);
    const lst = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(db, idHoaDon);
    if (hd != null) {
      setHoaDonOpen({
        ...hd,
      });
      setLstCTHD([...lst]);
      getInforCustomer(hd?.idKhachHang ?? "");

      navigation.setOptions({
        title: hd?.maHoaDon,
      });
    }
  };

  const getInforCustomer = async (idKhachHang: string) => {
    if (CommonFunc.checkNull_OrEmpty(idKhachHang)) {
      const kle: IKhachHangItemDto = {
        id: "",
        idKhachHang: null,
        maKhachHang: "KL",
        tenKhachHang: "Khách lẻ",
        soDienThoai: "",
      };
      setCustonerChosing({
        ...kle,
      });
    } else {
      const data = await KhachHangService.getDetail(idKhachHang);
      setCustonerChosing({
        ...data,
      });
    }
  };

  const CaculatorHD_byTongTienHang = async (tongTienHang: number) => {
    let ptGiamGiaHD = hoadonOpen.ptGiamGiaHD;
    let giamgiaHD = hoadonOpen.tongGiamGiaHD;
    let tongThue = hoadonOpen.tongTienThue;
    if (tongTienHang > 0) {
      if (ptGiamGiaHD > 0) {
        giamgiaHD = ((tongTienHang + tongThue) * ptGiamGiaHD) / 100;
      } else {
        if (giamgiaHD > tongTienHang) {
          giamgiaHD = 0;
        }
      }
    } else {
      giamgiaHD = 0;
      tongThue = 0;
    }
    let tongThanhToan = tongTienHang + tongThue - giamgiaHD;

    setHoaDonOpen({
      ...hoadonOpen,
      tongGiamGiaHD: giamgiaHD,
      tongTienThue: tongThue,
      tongTienHangChuaChietKhau: tongTienHang, // todo
      tongTienHang: tongTienHang,
      tongTienHDSauVAT: tongTienHang + tongThue,
      tongThanhToan: tongThanhToan,
    });
    await SQLLiteQuery.UpdateHD_fromCTHD(db, hoadonOpen?.id);
  };

  const tangSoLuong = async (item: IHoaDonChiTietDto) => {
    const slNew = item.soLuong + 1;
    setLstCTHD(
      lstCTHD?.map((x) => {
        if (x.id === item.id) {
          return {
            ...x,
            soLuong: slNew,
            thanhTienTruocCK: slNew * item?.donGiaTruocCK,
            thanhTienSauCK: slNew * item?.donGiaSauCK,
            thanhTienSauVAT: slNew * item?.donGiaSauVAT,
          };
        } else {
          return x;
        }
      })
    );
    item.soLuong = slNew;
    item.thanhTienTruocCK = slNew * item?.donGiaTruocCK;
    item.thanhTienSauCK = slNew * item?.donGiaTruocCK;
    item.thanhTienSauVAT = slNew * item?.donGiaSauVAT;
    await SQLLiteQuery.UpdateTo_HoaDonChiTiet(db, item);

    let tongtien = hoadonOpen.tongTienHang + item?.donGiaSauCK;
    CaculatorHD_byTongTienHang(tongtien);
  };

  const giamSoLuong = async (item: IHoaDonChiTietDto) => {
    let slNew = item.soLuong;
    if (slNew > 1) {
      slNew = slNew - 1;
      setLstCTHD(
        lstCTHD?.map((x) => {
          if (x.id === item.id) {
            return {
              ...x,
              soLuong: slNew,
              thanhTienTruocCK: slNew * item?.donGiaTruocCK,
              thanhTienSauCK: slNew * item?.donGiaSauCK,
              thanhTienSauVAT: slNew * item?.donGiaSauVAT,
            };
          } else {
            return x;
          }
        })
      );
      item.soLuong = slNew;
      item.thanhTienTruocCK = slNew * item?.donGiaTruocCK;
      item.thanhTienSauCK = slNew * item?.donGiaTruocCK;
      item.thanhTienSauVAT = slNew * item?.donGiaSauVAT;

      await SQLLiteQuery.UpdateTo_HoaDonChiTiet(db, item);
    } else {
      // remove from list
      setLstCTHD(lstCTHD?.filter((x) => x.id !== item.id));
      await SQLLiteQuery.DeleteHoaDonChiTiet_byId(db, item.id);

      setCurrentInvoice({
        ...currentInvoice,
        countProduct: (lstCTHD?.length ?? 0) - 1,
      });
    }
    let tongtien = hoadonOpen.tongTienHang - item?.donGiaSauCK;
    CaculatorHD_byTongTienHang(tongtien);
  };

  const showModalCustomer = () => {
    setIsShowModalCustomer(true);
  };
  const choseCustomer = async (cusChosed: IKhachHangItemDto) => {
    setIsShowModalCustomer(false);
    setCustonerChosing({
      ...cusChosed,
    });
    setHoaDonOpen({
      ...hoadonOpen,
      idKhachHang: cusChosed?.id,
    });
    await SQLLiteQuery.UpdateKhachHang_toHoaDon(
      db,
      hoadonOpen?.id,
      cusChosed?.id
    );
  };

  const Push_CTHD = async (
    arrProduct: IProductBasic[],
    cthd: IHoaDonChiTietDto[]
  ) => {
    for (let i = 0; i < arrProduct?.length; i++) {
      const itemFor = arrProduct[i];
      const newCTHD = new HoaDonChiTietDto({
        id: uuid.v4().toString(),
        idHoaDon: idHoaDon,
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

  const addNewProduct = async (arrIdQuyDoiChosed: string[]) => {
    let cthd = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(db, idHoaDon);
    const arrIdQuyDoiOld = cthd?.map((x) => {
      return x.idDonViQuyDoi;
    });

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
    const arrIdQuyDoiNew = arrIdQuyDoiChosed?.filter(
      (x) => !arrIdQuyDoiOld.includes(x)
    );

    // add new (from DB)
    const arrIdQuyDoi_fromDB = arrIdQuyDoiNew?.filter((x) => x.length > 1);
    const arrProduct: IProductBasic[] =
      await ProductService.GetInforBasic_OfListHangHoa_ByIdQuyDoi(
        arrIdQuyDoi_fromDB
      );
    cthd = await Push_CTHD(arrProduct, cthd);

    const datHDNew = await SQLLiteQuery.UpdateHD_fromCTHD(db, idHoaDon);
    if (datHDNew !== null) {
      setHoaDonOpen({
        ...hoadonOpen,
        tongTienThue: datHDNew?.tongTienThue,
        tongGiamGiaHD: datHDNew?.tongGiamGiaHD,
        tongChietKhauHangHoa: datHDNew?.tongChietKhauHangHoa,
        tongTienHangChuaChietKhau: datHDNew?.tongTienHangChuaChietKhau,
        tongTienHang: datHDNew?.tongTienHang,
        tongTienHDSauVAT: datHDNew?.tongTienHDSauVAT,
        tongThanhToan: datHDNew?.tongThanhToan,
      });
    }

    const cthdNew = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(
      db,
      idHoaDon
    );
    setLstCTHD([...cthdNew]);

    setIsShowModalAddProduct(false);
    setCurrentInvoice({
      ...currentInvoice,
      countProduct: (cthdNew?.length ?? 0) + 1,
    });
  };

  const gotoThanhToan = () => {
    route.navigate("/thanhtoan");
    setCurrentInvoice({
      ...currentInvoice,
      tongPhaiTra: hoadonOpen?.tongThanhToan ?? 0,
    });
  };

  return (
    <View style={[styles.container]}>
      <ModalListCustomer
        isShow={isShowModalCustomer}
        objUpdate={custonerChosing}
        onClose={() => setIsShowModalCustomer(false)}
        onSave={choseCustomer}
      />
      <SimpleDialog
        isShow={objSimpleDialog?.isShow ?? false}
        title={objSimpleDialog?.title}
        mes={objSimpleDialog?.mes}
        onClose={() =>
          setObjSimpleDialog({
            ...objSimpleDialog,
            isShow: false,
          })
        }
      />
      <ModalListProduct
        isShow={isShowModalAddProduct}
        onClose={() => setIsShowModalAddProduct(false)}
        onSave={addNewProduct}
      />
      <View style={styles.boxCustomer}>
        <View style={styles.boxCustomer_LeftRight}>
          <Icon size={18} type={IconType.FONT_AWESOME_5} name="user" />
          <View
            style={{
              gap: 8,
            }}
          >
            <Text
              style={{
                fontWeight: 500,
              }}
            >
              {custonerChosing?.tenKhachHang ?? "Khách lẻ"}
            </Text>
            {custonerChosing?.soDienThoai && (
              <Text
                style={{
                  fontSize: 13,
                  color: theme.colors.grey5,
                }}
              >
                {custonerChosing?.soDienThoai}
              </Text>
            )}
          </View>
        </View>
        <Pressable
          style={styles.boxCustomer_LeftRight}
          onPress={showModalCustomer}
        >
          <Text
            style={{
              textDecorationLine: "underline",
              fontSize: 12,
              color: theme.colors.primary,
            }}
          >
            Chọn lại khách
          </Text>
          <Icon name="arrow-forward-ios" type={IconType.MATERIAL} size={20} />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
        }}
      >
        <View style={{ flex: 7.5 }}>
          <Input
            errorStyle={{ height: 0 }}
            errorMessage=""
            leftIcon={{
              type: IconType.IONICON,
              name: "search",
              size: 14,
              style: {
                color: theme.colors.greyOutline,
              },
            }}
            placeholder="Tìm kiếm sản phẩm"
            containerStyle={{
              borderColor: theme.colors.greyOutline,
              padding: 0,
              backgroundColor: theme.colors.white,
              borderRadius: 8,
            }}
            inputStyle={{
              fontSize: 14,
            }}
            onChangeText={(text) => {
              setTxtSearchProduct(text);
            }}
          />
        </View>

        <Pressable
          style={{
            flex: 2.5,
            marginLeft: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setIsShowModalAddProduct(true)}
        >
          <Text
            style={{
              textDecorationLine: "underline",
              fontSize: 12,
              color: theme.colors.primary,
              textAlign: "center",
            }}
          >
            Thêm sản phẩm vào giỏ hàng
          </Text>
        </Pressable>
      </View>
      {lstSearchCTHD?.length === 0 ? (
        <View style={styles.container}>
          <View
            style={{
              gap: 12,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.colors.white,
            }}
          >
            <Icon type={IconType.FOUNDATION} name="page-add" size={20} />
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Chưa có sản phẩm
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.containerDetail}>
          <ScrollView
            style={{
              gap: 8,
              backgroundColor: theme.colors.white,
            }}
            contentContainerStyle={{ paddingBottom: 150 }}
          >
            {lstSearchCTHD?.map((item, index) => (
              <View
                key={item?.id}
                style={{
                  borderBottomWidth: index < lstSearchCTHD?.length - 1 ? 1 : 0,
                  borderBlockColor: theme.colors.greyOutline,
                  padding: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {item?.tenHangHoa}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: theme.colors.grey4,
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN").format(item?.donGiaSauCK)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Icon
                      type={IconType.IONICON}
                      name="remove-circle-outline"
                      size={30}
                      color={theme.colors.greyOutline}
                      onPress={() => giamSoLuong(item)}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {item?.soLuong}
                    </Text>
                    <Icon
                      type={IconType.IONICON}
                      name="add-circle-outline"
                      size={30}
                      color={theme.colors.greyOutline}
                      onPress={() => tangSoLuong(item)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={[styles.boxInvoice, { paddingBottom: insets.bottom }]}>
        <View
          style={{
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.primary,
          }}
        >
          <View
            style={{
              gap: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Tổng tiền hàng</Text>
              <Text
                style={{
                  fontSize: 18,
                }}
              >
                {new Intl.NumberFormat("vi-VN").format(
                  hoadonOpen?.tongTienHang
                )}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Giảm giá</Text>
              <Text
                style={{
                  fontSize: 18,
                }}
              >
                {new Intl.NumberFormat("vi-VN").format(
                  hoadonOpen?.tongGiamGiaHD
                )}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Tổng cộng</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {new Intl.NumberFormat("vi-VN").format(
                  hoadonOpen?.tongThanhToan
                )}
              </Text>
            </View>
          </View>
        </View>
        <Button
          titleStyle={{
            fontSize: 18,
          }}
          size="lg"
          containerStyle={{
            marginTop: 8,
          }}
          buttonStyle={{
            borderRadius: 4,
          }}
          onPress={gotoThanhToan}
        >
          <Icon
            name="check"
            color={theme.colors.white}
            containerStyle={{
              marginRight: 10,
            }}
          />
          Thanh toán
        </Button>
      </View>
    </View>
  );
}

const createStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.grey5,
      flex: 1,
      position: "relative",
    },
    boxInvoice: {
      bottom: 8,
      position: "absolute",
      width: "100%",
      padding: 8,
      backgroundColor: theme.colors.white,
    },
    boxCustomer: {
      paddingHorizontal: 8,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.colors.white,
    },
    boxCustomer_LeftRight: {
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
    },
    containerDetail: {
      paddingHorizontal: 8,
    },
  });
