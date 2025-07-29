import { TextLink } from "@/components/_text_link";
import { Modal_ListTaiKhoanNganHang } from "@/components/modal_list_tai_khoan_ngan_hang";
import { SimpleDialog } from "@/components/simple_dialog";
import ApiConst from "@/const/ApiConst";
import { DiaryStatus } from "@/enum/DiaryStatus";
import { HinhThucThanhToan } from "@/enum/HinhThucThanhToan";
import { IconType } from "@/enum/IconType";
import { LoaiChungTu } from "@/enum/LoaiChungTu";
import { IHoaDonDto } from "@/services/hoadon/dto";
import HoaDonService from "@/services/hoadon/HoaDonService";
import { INhatKyThaoTacDto } from "@/services/nhat_ky_su_dung/INhatKyThaoTacDto";
import NhatKyThaoTacService from "@/services/nhat_ky_su_dung/NhatKyThaoTacService";
import { IQuyChitietDto } from "@/services/so_quy/IQuyChitietDto";
import { IQuyHoaDonDto } from "@/services/so_quy/IQuyHoaDonDto";
import SoQuyService from "@/services/so_quy/SoQuyService";
import { ITaiKhoanNganHangDto } from "@/services/tai_khoan_ngan_hang/ITaiKhoanNganHangDto";
import SQLLiteQuery from "@/store/expo-sqlite/SQLLiteQuery";
import { useAppContext } from "@/store/react_context/AppProvider";
import { useSaleManagerStackContext } from "@/store/react_context/SaleManagerStackProvide";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import {
  Button,
  CheckBox,
  Icon,
  Image,
  Input,
  Text,
  useTheme,
} from "@rneui/themed";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ThanhToan() {
  const route = useRouter();
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();
  const idHoaDon = currentInvoice?.idHoaDon ?? "";
  const idChiNhanhCurrent = chiNhanhCurrent?.id ?? null;
  const tongPhaiTra = currentInvoice?.tongPhaiTra ?? 0;
  const [isSaving, setIsSaving] = useState(false);
  const [tienMat, setTienMat] = useState(
    CommonFunc.formatCurrency(tongPhaiTra)
  );
  const [tienChuyenKhoan, setTienChuyenKhoan] = useState("0");
  const [tienQuyeThePos, setTienQuyeThePos] = useState("0");
  const [tienTheGiaTri, setTienTheGiaTri] = useState("0");
  const [soDuTheGiaTri, setSoDuTheGiaTri] = useState("0");
  const [noiDungThu, setNoiDungThu] = useState("");
  const [qrCode, setQRCode] = useState("");

  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();

  const [laTaiKhoanhChuyenKhoan, setLaTaiKhoanhChuyenKhoan] = useState(false);

  const [isShowModalTaiKhoanNganHang, setIsShowModalTaiKhoanNganHang] =
    useState(false);
  const [idTaiKhoanChuyenKhoan, setIdTaiKhoanChuyenKhoan] = useState<
    string | null
  >("");
  const [idTaiKhoanPOS, setIdTaiKhoanPOS] = useState<string | null>("");
  const [taiKhoanCKChosed, setTaiKhoanCKChosed] =
    useState<ITaiKhoanNganHangDto>();
  const [taiKhoanPOSChosed, setTaiKhoanPOSChosed] =
    useState<ITaiKhoanNganHangDto>();

  const [hoadonOpen, setHoaDonOpen] = useState<IHoaDonDto>({
    id: idHoaDon,
  } as IHoaDonDto);

  const [arrHinhThucChosed, setArrHinhThucChosed] = useState([
    HinhThucThanhToan.TIEN_MAT,
  ]);

  const arrPhuongThucTT = [
    {
      id: HinhThucThanhToan.TIEN_MAT,
      text: "Tiển mặt",
    },
    {
      id: HinhThucThanhToan.CHUYEN_KHOAN,
      text: "Chuyển khoản",
    },
    {
      id: HinhThucThanhToan.QUYET_THE,
      text: "POS",
    },
  ];

  const tienKhachDua =
    CommonFunc.formatNumberToFloat(tienTheGiaTri) +
    CommonFunc.formatNumberToFloat(tienMat) +
    CommonFunc.formatNumberToFloat(tienChuyenKhoan) +
    CommonFunc.formatNumberToFloat(tienQuyeThePos);
  const tienKhachThieu = tongPhaiTra - tienKhachDua;

  const GetInforHoadon_fromCache = async () => {
    const data = await SQLLiteQuery.GetHoaDon_byId(db, idHoaDon);
    if (data !== null) {
      setHoaDonOpen({
        ...data,
      });
    }
  };

  useEffect(() => {
    GetInforHoadon_fromCache();
  }, [idHoaDon]);

  useEffect(() => {
    AssignAgain_LoaiTien(arrHinhThucChosed);
  }, [arrHinhThucChosed]);

  const AssignAgain_LoaiTien = (arrNew: HinhThucThanhToan[]) => {
    switch (arrNew?.length) {
      case 0: {
        setTienMat("0");
        setTienChuyenKhoan("0");
        setTienQuyeThePos("0");
      }
      case 1:
        {
          if (arrNew.includes(HinhThucThanhToan.TIEN_MAT)) {
            setTienMat(CommonFunc.formatCurrency(tongPhaiTra));
            setTienChuyenKhoan("0");
            setTienQuyeThePos("0");
          } else {
            if (arrNew.includes(HinhThucThanhToan.CHUYEN_KHOAN)) {
              setTienChuyenKhoan(CommonFunc.formatCurrency(tongPhaiTra));
              setTienMat("0");
              setTienQuyeThePos("0");
            } else {
              if (arrNew.includes(HinhThucThanhToan.QUYET_THE)) {
                setTienQuyeThePos(CommonFunc.formatCurrency(tongPhaiTra));
                setTienMat("0");
                setTienChuyenKhoan("0");
              }
            }
          }
        }
        break;
      case 2:
        {
          if (arrNew.includes(HinhThucThanhToan.TIEN_MAT)) {
            setTienMat(CommonFunc.formatCurrency(tongPhaiTra));
            setTienChuyenKhoan("0");
            setTienQuyeThePos("0");
          } else {
            setTienMat("0");
            setTienChuyenKhoan("0");
            setTienQuyeThePos("0");
          }
        }
        break;
    }
  };

  const changeHinhThucThanhToan = (id: HinhThucThanhToan) => {
    setArrHinhThucChosed((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Nếu đã chọn thì bỏ chọn
      } else {
        return [...prev, id]; // Nếu chưa chọn thì chọn
      }
    });
  };

  const editTienTheGiaTri = (value: string) => {
    let gtri = CommonFunc.formatNumberToFloat(value);
    let soDuThe = CommonFunc.formatNumberToFloat(soDuTheGiaTri);
    if (gtri > soDuThe) {
      gtri = soDuThe;
    }
    setTienTheGiaTri(CommonFunc.formatCurrency(gtri));

    let conLai = 0;
    if (gtri < tongPhaiTra) {
      conLai = tongPhaiTra - gtri;
    }
    setTienMat(CommonFunc.formatCurrency(conLai));
    setTienChuyenKhoan("0");
    setTienQuyeThePos("0");
  };

  const editTienMat = (value: string) => {
    const gtri = CommonFunc.formatNumberToFloat(value);
    setTienMat(CommonFunc.formatCurrency(gtri));

    const tongThanhToan = gtri + CommonFunc.formatNumberToFloat(tienTheGiaTri);
    let conLai = 0;
    if (tongThanhToan < tongPhaiTra) {
      conLai = tongPhaiTra - tongThanhToan;
    }
    if (!CommonFunc.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)) {
      setTienChuyenKhoan(CommonFunc.formatCurrency(conLai));
      setTienQuyeThePos("0");
    } else {
      if (!CommonFunc.checkNull_OrEmpty(idTaiKhoanPOS)) {
        setTienQuyeThePos(CommonFunc.formatCurrency(conLai));
      } else {
        setTienQuyeThePos("0");
      }
      setTienChuyenKhoan("0");
    }
  };

  const showModalTaiKhoanNganHang = (laChuyenKhoan: boolean) => {
    setIsShowModalTaiKhoanNganHang(true);
    setLaTaiKhoanhChuyenKhoan(laChuyenKhoan);
  };

  const changeTaiKhoanNganHang = (laChuyenKhoan: boolean) => {
    setIsShowModalTaiKhoanNganHang(true);
    setLaTaiKhoanhChuyenKhoan(laChuyenKhoan);
  };

  const checkSave = () => {
    if (tienKhachDua === 0) {
      setObjSimpleDialog({
        ...objSimpleDialog,
        isShow: true,
        title: "Thông báo",
        mes: "Vui lòng nhập số tiền cần thanh toán",
      });
      return false;
    }

    if (
      CommonFunc.formatNumberToFloat(tienChuyenKhoan) > 0 &&
      CommonFunc.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)
    ) {
      setObjSimpleDialog({
        ...objSimpleDialog,
        isShow: true,
        title: "Thông báo",
        mes: "Vui lòng chọn tài khoản chuyển khoản",
      });
      return false;
    }
    if (
      CommonFunc.formatNumberToFloat(tienQuyeThePos) > 0 &&
      CommonFunc.checkNull_OrEmpty(idTaiKhoanPOS)
    ) {
      setObjSimpleDialog({
        ...objSimpleDialog,
        isShow: true,
        title: "Thông báo",
        mes: "Vui lòng chọn tài khoản POS",
      });
      return false;
    }

    return true;
  };

  const thanhToan = async () => {
    const check = checkSave();
    if (!check) {
      return;
    }
    const lstCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(
      db,
      hoadonOpen?.id
    );
    hoadonOpen.idChiNhanh = idChiNhanhCurrent;
    hoadonOpen.maHoaDon = "";
    const dataHD = await HoaDonService.InsertHoaDon(hoadonOpen);
    if (dataHD !== null) {
      const datHDCT = await HoaDonService.InsertHoaDonChiTiet(
        dataHD?.id,
        lstCTHD
      );
      if (datHDCT) {
        const objShareMoney = SoQuyService.ShareMoney({
          phaiTT: tongPhaiTra,
          tienMat: CommonFunc.formatNumberToFloat(tienMat),
          tienChuyenKhoan: CommonFunc.formatNumberToFloat(tienChuyenKhoan),
          tienPOS: CommonFunc.formatNumberToFloat(tienQuyeThePos),
        });
        const tongThu =
          objShareMoney.TienMat +
          objShareMoney.TienChuyenKhoan +
          objShareMoney.TienPOS;

        await saveDiaryHoaDon(dataHD, tongThu);

        setObjSimpleDialog({
          ...objSimpleDialog,
          isShow: true,
          title: "Thông báo",
          mes: "Tạo hóa đơn thành công",
        });

        if (tongThu > 0) {
          const quyHD: IQuyHoaDonDto = {
            id: ApiConst.GUID_EMPTY,
            idChiNhanh: idChiNhanhCurrent,
            idNhanVien: null, // todo
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            tongTienThu: tongThu,
            ngayLapHoaDon: dayjs(hoadonOpen?.ngayLapHoaDon).format(
              "YYYY-MM-DD"
            ),
            noiDungThu: noiDungThu,
            hachToanKinhDoanh: true,
          };
          console.log("quyHD ", quyHD);
          const dataQuyHD = await SoQuyService.InsertQuyHoaDon(quyHD);

          const lstQuyCT = [];
          if (objShareMoney.TienMat > 0) {
            const quyct: IQuyChitietDto = {
              id: ApiConst.GUID_EMPTY,
              idQuyHoaDon: dataQuyHD.id,
              tienThu: objShareMoney.TienMat,
              hinhThucThanhToan: HinhThucThanhToan.TIEN_MAT,
              idHoaDonLienQuan: dataHD.id,
              idKhachHang: dataHD.idKhachHang,
              idTaiKhoanNganHang: null,
            };
            lstQuyCT.push(quyct);
          }
          if (objShareMoney.TienChuyenKhoan > 0) {
            const quyct: IQuyChitietDto = {
              id: ApiConst.GUID_EMPTY,
              idQuyHoaDon: dataQuyHD.id,
              tienThu: objShareMoney.TienChuyenKhoan,
              hinhThucThanhToan: HinhThucThanhToan.CHUYEN_KHOAN,
              idHoaDonLienQuan: dataHD.id,
              idKhachHang: dataHD.idKhachHang,
              idTaiKhoanNganHang: idTaiKhoanChuyenKhoan,

              // tenNganHang: taiKhoanCKChosed?.tenChuThe,
              // maPinNganHang: taiKhoanCKChosed?.tenChuThe,
              tenChuThe: taiKhoanCKChosed?.tenChuThe,
              soTaiKhoan: taiKhoanCKChosed?.soTaiKhoan,
            };
            lstQuyCT.push(quyct);
          }
          if (objShareMoney.TienPOS > 0) {
            const quyct: IQuyChitietDto = {
              id: ApiConst.GUID_EMPTY,
              idQuyHoaDon: dataQuyHD.id,
              tienThu: objShareMoney.TienPOS,
              hinhThucThanhToan: HinhThucThanhToan.QUYET_THE,
              idHoaDonLienQuan: dataHD.id,
              idKhachHang: dataHD.idKhachHang,
              idTaiKhoanNganHang: idTaiKhoanPOS,

              tenChuThe: taiKhoanPOSChosed?.tenChuThe,
              soTaiKhoan: taiKhoanPOSChosed?.soTaiKhoan,
            };
            lstQuyCT.push(quyct);
          }

          await SoQuyService.InsertQuyHoaDonChiTiet(dataQuyHD.id, lstQuyCT);
          await saveDiaryQuyHD(quyHD, lstQuyCT);
        }

        await SQLLiteQuery.RemoveHoaDon_byId(db, idHoaDon);

        route.navigate("/(drawer)/(sale-stack)/(tabs)/temp-invoice");
      }
    }
  };

  const saveDiaryHoaDon = async (hoadon: IHoaDonDto, tongthu: number) => {
    // <br /> Ngày lập: ${format(new Date(hoadon?.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')}
    const sNoiDungChiTiet = `<br /> Mã hóa đơn: ${hoadon?.maHoaDon},
    <br /> Ngày lập: ${dayjs(hoadonOpen?.ngayLapHoaDon).format(
      "dd/MM/yyyy HH:mm"
    )}
    <br /> Khách hàng: ${hoadonOpen?.tenKhachHang} (${hoadonOpen?.maKhachHang}) 
    <br /> Phải thanh toán: ${CommonFunc.formatCurrency(hoadon?.tongThanhToan)}
    <br /> Đã thanh toán: ${CommonFunc.formatCurrency(tongthu)}`;
    let sChiTietHD = "";
    const lstCTHD = await SQLLiteQuery.GetChiTietHoaDon_byIdHoaDon(
      db,
      idHoaDon
    );
    for (let i = 0; i < lstCTHD?.length; i++) {
      const itFor = lstCTHD[i];
      sChiTietHD += `<br /> ${itFor.tenHangHoa}: Số lượng ${
        itFor.soLuong
      }, Đơn giá ${CommonFunc.formatCurrency(
        itFor.donGiaSauVAT
      )}, Thành tiền ${CommonFunc.formatCurrency(itFor.thanhTienSauVAT)}`;
    }
    sChiTietHD = "<br /> Chi tiết hóa đơn: " + sChiTietHD;
    const diary: INhatKyThaoTacDto = {
      idChiNhanh: idChiNhanhCurrent,
      loaiNhatKy: DiaryStatus.INSERT,
      chucNang: "Hóa đơn",
      noiDung: `Thêm mới hóa đơn '  ${hoadon?.maHoaDon}`,
      noiDungChiTiet: sNoiDungChiTiet + sChiTietHD,
    };

    await NhatKyThaoTacService.CreateNhatKyHoatDong(diary);
  };

  const saveDiaryQuyHD = async (
    quyHD: IQuyHoaDonDto,
    lstQuyCT: IQuyChitietDto[]
  ) => {
    let sPhuongThucTT = "";
    const arrPhuongThucTT = lstQuyCT?.map((x) => {
      return x.hinhThucThanhToan;
    });
    if (arrPhuongThucTT?.includes(HinhThucThanhToan.TIEN_MAT)) {
      sPhuongThucTT = "Tiền mặt, ";
    }
    if (arrPhuongThucTT?.includes(HinhThucThanhToan.CHUYEN_KHOAN)) {
      sPhuongThucTT = "Chuyển khoản,";
    }
    if (arrPhuongThucTT?.includes(HinhThucThanhToan.TIEN_MAT)) {
      sPhuongThucTT = "POS";
    }
    sPhuongThucTT = CommonFunc.remove_LastComma(sPhuongThucTT);
    const dateStr = dayjs(hoadonOpen?.ngayLapHoaDon).format("dd/MM/yyyy HH:mm");
    const sNoiDungChiTiet = `Mã phiếu: ${
      quyHD?.maHoaDon
    } <br /> Ngày lập: ${dateStr}
      <br /> Khách hàng: ${hoadonOpen?.tenKhachHang} (${
      hoadonOpen?.maKhachHang
    }) 
      <br /> Tổng thu: ${CommonFunc.formatCurrency(quyHD?.tongTienThu)}
      <br /> Nội dung: ${quyHD?.noiDungThu}
      <br /> Phương thức thanh toán: ${sPhuongThucTT}`;

    const diary: INhatKyThaoTacDto = {
      idChiNhanh: idChiNhanhCurrent,
      loaiNhatKy: DiaryStatus.INSERT,
      chucNang: "Sổ quỹ",
      noiDung: `Thêm mới phiếu thu '  ${quyHD?.maHoaDon}`,
      noiDungChiTiet: sNoiDungChiTiet,
    };

    await NhatKyThaoTacService.CreateNhatKyHoatDong(diary);
  };

  const agreeChoseTaiKhoanNganHang = (itemChosed: ITaiKhoanNganHangDto) => {
    setIsShowModalTaiKhoanNganHang(false);
    if (laTaiKhoanhChuyenKhoan) {
      setTaiKhoanCKChosed(itemChosed);
      setIdTaiKhoanChuyenKhoan(itemChosed?.id);
    } else {
      setTaiKhoanPOSChosed(itemChosed);
      setIdTaiKhoanPOS(itemChosed?.id);
    }
  };

  const onCloseSimpleDialog = () => {
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: false,
    });
  };

  return (
    <View style={[styles.container]}>
      <Modal_ListTaiKhoanNganHang
        isShow={isShowModalTaiKhoanNganHang}
        onClose={() => setIsShowModalTaiKhoanNganHang(false)}
        onSave={agreeChoseTaiKhoanNganHang}
      />
      <SimpleDialog
        isShow={objSimpleDialog?.isShow ?? false}
        title={objSimpleDialog?.title}
        mes={objSimpleDialog?.mes}
        onClose={onCloseSimpleDialog}
      />
      <View style={{ gap: 16, marginTop: 16, padding: 8 }}>
        <View style={styles.flexRow}>
          <Text style={styles.textInfor}>Tổng phải trả</Text>
          <Text style={styles.textInfor}>
            {new Intl.NumberFormat("vi-VN").format(
              hoadonOpen?.tongThanhToan ?? 0
            )}
          </Text>
        </View>
        <View style={styles.boxCheckPhuongThucTT}>
          <Text>Phương thức thanh toán</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 0,
            }}
          >
            {arrPhuongThucTT?.map((item) => (
              <CheckBox
                key={item.id}
                title={item.text}
                containerStyle={{
                  marginLeft: 0,
                }}
                checked={arrHinhThucChosed.includes(item.id)}
                onPress={() => {
                  changeHinhThucThanhToan(item.id);
                }}
              />
            ))}
          </View>
        </View>

        <ScrollView>
          {arrHinhThucChosed?.includes(HinhThucThanhToan.TIEN_MAT) && (
            <View style={styles.itemLoaiTien}>
              <Text>Tiền mặt</Text>
              <Input
                inputStyle={{
                  textAlign: "right",
                }}
                value={tienMat?.toString()}
                onChangeText={(txt) => editTienMat(txt)}
              />
            </View>
          )}

          {arrHinhThucChosed?.includes(HinhThucThanhToan.CHUYEN_KHOAN) && (
            <View style={[styles.flexRow, { gap: 8, marginTop: 20 }]}>
              <View style={styles.itemLoaiTien}>
                <Text>Chuyển khoản</Text>
                <Input
                  inputStyle={{
                    textAlign: "right",
                  }}
                  value={tienChuyenKhoan}
                  onChangeText={(text) =>
                    setTienChuyenKhoan(
                      CommonFunc.formatCurrency(
                        CommonFunc.formatNumberToFloat(text)
                      )
                    )
                  }
                />
              </View>

              {!CommonFunc.checkNull_OrEmpty(idTaiKhoanChuyenKhoan) ? (
                <View
                  style={{
                    width: "40%",
                  }}
                >
                  <View style={styles.accountItem}>
                    <Image
                      style={{
                        height: 60,
                      }}
                      source={{
                        uri: taiKhoanCKChosed?.logoNganHang,
                      }}
                    />

                    <View>
                      <Text
                        style={{
                          fontWeight: 500,
                          fontSize: 18,
                          textAlign: "center",
                        }}
                      >
                        {taiKhoanCKChosed?.tenChuThe ?? ""}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.grey4,
                          textAlign: "center",
                        }}
                      >
                        {taiKhoanCKChosed?.soTaiKhoan ?? ""}
                      </Text>
                    </View>
                  </View>
                  <TextLink
                    lable="Thay đổi"
                    overrideStyles={{ textAlign: "center" }}
                    onPress={() => changeTaiKhoanNganHang(true)}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.flexRow,
                    {
                      width: "40%",
                    },
                  ]}
                  onPress={() => showModalTaiKhoanNganHang(true)}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      textAlign: "center",
                    }}
                  >
                    Chọn tài khoản nhận
                  </Text>
                  <Icon
                    size={30}
                    name="keyboard-double-arrow-right"
                    type={IconType.MATERIAL}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {arrHinhThucChosed.includes(HinhThucThanhToan.QUYET_THE) && (
            <View style={[styles.flexRow, { gap: 16, marginTop: 20 }]}>
              <View style={styles.itemLoaiTien}>
                <Text>POS</Text>
                <Input
                  inputStyle={{
                    textAlign: "right",
                  }}
                  value={tienQuyeThePos}
                  onChangeText={(text) =>
                    setTienQuyeThePos(
                      CommonFunc.formatCurrency(
                        CommonFunc.formatNumberToFloat(text)
                      )
                    )
                  }
                />
              </View>
              {!CommonFunc.checkNull_OrEmpty(idTaiKhoanPOS) ? (
                <View
                  style={{
                    width: "40%",
                  }}
                >
                  <View style={styles.accountItem}>
                    <Image
                      style={{
                        height: 60,
                      }}
                      source={{
                        uri: taiKhoanPOSChosed?.logoNganHang,
                      }}
                    />

                    <View>
                      <Text
                        style={{
                          fontWeight: 500,
                          fontSize: 18,
                          textAlign: "center",
                        }}
                      >
                        {taiKhoanPOSChosed?.tenChuThe ?? ""}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.grey4,
                          textAlign: "center",
                        }}
                      >
                        {taiKhoanPOSChosed?.soTaiKhoan ?? ""}
                      </Text>
                    </View>
                    <TextLink
                      lable="Thay đổi"
                      overrideStyles={{ textAlign: "center" }}
                      onPress={() => changeTaiKhoanNganHang(false)}
                    />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.flexRow,
                    {
                      width: "40%",
                    },
                  ]}
                  onPress={() => showModalTaiKhoanNganHang(false)}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      textAlign: "center",
                    }}
                  >
                    Chọn tài khoản nhận
                  </Text>
                  <Icon
                    size={30}
                    name="keyboard-double-arrow-right"
                    type={IconType.MATERIAL}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 8,
          width: "100%",
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.white,
        }}
      >
        <View style={{ gap: 16, paddingHorizontal: 8 }}>
          <Input
            placeholder="Nội dung thanh toán"
            inputStyle={{
              fontStyle: "italic",
              fontSize: 14,
            }}
            value={noiDungThu}
            onChangeText={(text) => setNoiDungThu(text)}
          />
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.colors.black,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <View
              style={{
                gap: 16,
              }}
            >
              <View style={styles.flexRow}>
                <View
                  style={{
                    gap: 16,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    Tổng khách trả
                  </Text>
                  <Text>{tienKhachThieu < 0 ? "Tiền thừa" : "Còn thiếu"}</Text>
                </View>
                <View
                  style={{
                    gap: 16,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {CommonFunc.formatCurrency(tienKhachDua)}
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                    }}
                  >
                    {CommonFunc.formatCurrency(Math.abs(tienKhachThieu))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Button
            title={"Thanh toán"}
            size="lg"
            containerStyle={{
              borderRadius: 4,
            }}
            onPress={thanhToan}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      flex: 1,
      position: "relative",
    },
    flexRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textInfor: {
      fontSize: 18,
      fontWeight: 600,
    },
    boxCheckPhuongThucTT: { gap: 8, width: "100%" },
    itemLoaiTien: {
      padding: 16,
      borderRadius: 16,
      justifyContent: "space-between",
      borderColor: theme.colors.greyOutline,
      borderWidth: 1,
      width: "60%",
    },
    accountItem: {
      padding: 5,
    },
  });
