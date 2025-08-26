import { TitleModal } from "@/components/_title_modal";
import { BackDropView } from "@/components/back_drop_view";
import { ModalContainer } from "@/components/modal_container";
import ApiConst from "@/const/ApiConst";
import { ActionType } from "@/enum/ActionType";
import { DiaryStatus } from "@/enum/DiaryStatus";
import { IconType } from "@/enum/IconType";
import { INhatKyThaoTacDto } from "@/services/nhat_ky_su_dung/INhatKyThaoTacDto";
import NhatKyThaoTacService from "@/services/nhat_ky_su_dung/NhatKyThaoTacService";
import { IProductBasic, ProductDto } from "@/services/product/dto";
import ProductService from "@/services/product/ProductService";
import { IProductGroupDto } from "@/services/product_group/dto";
import { useAppContext } from "@/store/react_context/AppProvider";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { Button, Icon, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalListProductGroup from "../product_group/list_group_product";
import { TextFieldCustom } from "../text_filed_custom";

const ModalAddProduct = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<IProductBasic>) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const [giaBan, setGiaBan] = useState("");
  const [titleModal, setTitleModal] = useState("");
  const [isShowModalListProductGroup, setIsShowModalListProductGroup] =
    useState(false);
  const [errors, setErrors] = useState({ maHangHoa: "", tenHangHoa: "" });
  const [objProduct, setObjProduct] = useState<ProductDto>(
    new ProductDto({ id: ApiConst.GUID_EMPTY })
  );

  useEffect(() => {
    if (isShow) {
      if (CommonFunc.checkNull_OrEmpty(objUpdate?.idDonViQuyDoi ?? "")) {
        setTitleModal("Sản phẩm mới");
        ResetData();
        setObjProduct(new ProductDto({ id: ApiConst.GUID_EMPTY }));
      } else {
        setTitleModal("Sửa đổi sản phẩm");
        setGiaBan((objUpdate?.giaBan ?? 0).toString());

        setObjProduct((prev) => {
          return {
            ...prev,
            id: objUpdate?.id ?? "",
            idHangHoa: objUpdate?.id ?? "",
            idDonViQuyDoi: objUpdate?.idDonViQuyDoi ?? "",
            maHangHoa: objUpdate?.maHangHoa ?? "",
            tenHangHoa: objUpdate?.tenHangHoa ?? "",
            giaBan: objUpdate?.giaBan ?? 0,
            idNhomHangHoa: objUpdate?.idNhomHangHoa ?? "",
            tenNhomHang: objUpdate?.tenNhomHang ?? "",
          };
        });
      }
    }
  }, [isShow]);

  const ResetData = () => {
    setIsSaving(false);
    setGiaBan("");
    setErrors({ maHangHoa: "", tenHangHoa: "" });
  };

  const showModalProductGroup = () => {
    setIsShowModalListProductGroup(true);
  };

  const checkSave = async () => {
    let errors = {
      maHangHoa: "",
      tenHangHoa: "",
    };
    if (!CommonFunc.checkNull(objProduct?.maHangHoa)) {
      const exists = await ProductService.CheckExistsMaHangHoa(
        objProduct?.maHangHoa ?? "",
        objProduct?.idDonViQuyDoi ?? ApiConst.GUID_EMPTY
      );
      if (exists) {
        errors.maHangHoa = "Mã sản phẩm đã tồn tại";
      }
    }

    if (CommonFunc.checkNull(objProduct?.tenHangHoa)) {
      errors.tenHangHoa = "Vui lòng nhập tên sản phẩm";
    }
    setErrors({ maHangHoa: errors.maHangHoa, tenHangHoa: errors.tenHangHoa });

    return (
      CommonFunc.checkNull(errors?.maHangHoa) &&
      CommonFunc.checkNull(errors?.tenHangHoa)
    );
  };

  const onSaveProduct = async () => {
    const check = await checkSave();
    if (!check) {
      return false;
    }
    setIsSaving(true);
    console.log("check ", check, isSaving);
    if (isSaving) return;

    const input = { ...objProduct };
    input.giaBan = CommonFunc.formatNumberToFloat(giaBan);
    input.tenHangHoa_KhongDau = CommonFunc.convertString_toEnglish(
      objProduct.tenHangHoa ?? ""
    );
    input.donViQuiDois = [
      {
        id: input.idDonViQuyDoi,
        maHangHoa: input.maHangHoa,
        tenDonViTinh: "",
        tyLeChuyenDoi: 1,
        giaBan: input.giaBan,
        giaVon: input?.giaVon ?? 0,
        laDonViTinhChuan: 1,
      },
    ];
    console.log("input ", input);
    const result = await ProductService.CreateOrOEdit(input);
    setIsSaving(false);

    if (result) {
      const dvChuan = result?.donViQuiDois?.filter(
        (x: any) => x.laDonViTinhChuan === 1
      );
      result.giaBan = input.giaBan;
      if (dvChuan && dvChuan?.length > 0) {
        result.maHangHoa = dvChuan[0].maHangHoa;
        result.idDonViQuyDoi = dvChuan[0].id;
      }

      if (CommonFunc.checkNull_OrEmpty(objUpdate?.idDonViQuyDoi)) {
        const diary: INhatKyThaoTacDto = {
          idChiNhanh: chiNhanhCurrent?.id ?? "",
          loaiNhatKy: DiaryStatus.INSERT,
          chucNang: "Danh mục sản phẩm",
          noiDung: `Thêm mới sản phẩm ${result?.tenHangHoa} (${result?.maHangHoa})`,
          noiDungChiTiet: `Thêm mới sản phẩm ${result?.tenHangHoa} (${
            result?.maHangHoa
          }) <br />- Giá bán: ${CommonFunc.formatNumbertInput(giaBan)}
         <br />- Nhóm sản phẩm: ${objProduct?.tenNhomHang ?? ""}`,
        };
        await NhatKyThaoTacService.CreateNhatKyHoatDong(diary);
      } else {
        const diary: INhatKyThaoTacDto = {
          idChiNhanh: chiNhanhCurrent?.id ?? "",
          loaiNhatKy: DiaryStatus.UPDATE,
          chucNang: "Danh mục sản phẩm",
          noiDung: `Cập nhật sản phẩm ${result?.tenHangHoa} (${result?.maHangHoa})`,
          noiDungChiTiet: `Cập nhật sản phẩm ${result?.tenHangHoa} (${
            result?.maHangHoa
          }) <br />- Giá bán: ${CommonFunc.formatNumbertInput(giaBan)}
          <br />- Nhóm sản phẩm: ${objProduct?.tenNhomHang ?? ""}
          <br /> Thông tin cũ: 
          <br /> Mã sản phẩm ${objUpdate?.maHangHoa}
          <br /> Tên sản phẩm ${objUpdate?.tenHangHoa}
          <br /> Giá bán ${CommonFunc.formatCurrency(objUpdate?.giaBan ?? 0)}
          <br /> Thuộc nhóm ${objUpdate?.tenNhomHang}`,
        };
        await NhatKyThaoTacService.CreateNhatKyHoatDong(diary);
      }

      onSave(result, ActionType.INSERT);
    }
  };

  const onChoseProductGroup = async (item: IProductGroupDto) => {
    setObjProduct({
      ...objProduct,
      idNhomHangHoa: item?.id,
      tenNhomHang: item?.tenNhomHang,
    });
    setIsShowModalListProductGroup(false);
  };

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <ModalListProductGroup
        isShow={isShowModalListProductGroup}
        onClose={() => setIsShowModalListProductGroup(false)}
        onSave={onChoseProductGroup}
      />
      <BackDropView>
        <ModalContainer
          style={{
            position: "relative",
          }}
        >
          <TitleModal
            title={titleModal}
            onClose={onClose}
            style={{ backgroundColor: theme.colors.primary }}
          />

          <View style={{ gap: 8, padding: 16 }}>
            <TextFieldCustom
              label="Mã sản phẩm"
              variant="outlined"
              placeholder="Mã tự động"
              onChangeText={(txt) => {
                setObjProduct({ ...objProduct, maHangHoa: txt });
                setErrors({ ...errors, maHangHoa: "" });
              }}
              value={objProduct?.maHangHoa ?? ""}
              error={
                CommonFunc.checkNull(errors?.maHangHoa ?? "") ? false : true
              }
              helperText={errors?.maHangHoa}
            />
            <TextFieldCustom
              label="Tên sản phẩm"
              variant="outlined"
              value={objProduct?.tenHangHoa}
              onChangeText={(txt) => {
                setObjProduct({ ...objProduct, tenHangHoa: txt });
                setErrors({ ...errors, tenHangHoa: "" });
              }}
              error={
                CommonFunc.checkNull(errors?.tenHangHoa ?? "") ? false : true
              }
              helperText={errors?.tenHangHoa}
            />

            <Text>Giá bán</Text>
            <TextInput
              keyboardType="numeric"
              value={CommonFunc.formatNumbertInput(giaBan)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                padding: 12,
                fontSize: 16,
                color: "black",
                textAlign: "right",
              }}
              onChangeText={(txt) => setGiaBan(txt)}
            />

            <TouchableOpacity
              onPress={showModalProductGroup}
              style={{ marginTop: 12 }}
            >
              <TextFieldCustom
                label="Nhóm sản phẩm"
                variant="outlined"
                value={
                  CommonFunc.checkNull(objProduct?.tenNhomHang)
                    ? "Chọn nhóm"
                    : objProduct?.tenNhomHang
                }
                readOnly
                endIcon={
                  <Icon
                    name="navigate-next"
                    type={IconType.MATERIAL}
                    size={30}
                    onPress={() => setIsShowModalListProductGroup(true)}
                  />
                }
              />
            </TouchableOpacity>

            <View style={{ paddingTop: 20, gap: 8 }}>
              <Button radius={"md"} onPress={onSaveProduct}>
                {CommonFunc.checkNull_OrEmpty(objUpdate?.idDonViQuyDoi ?? "")
                  ? "Thêm mới"
                  : "Cập nhật "}
              </Button>
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalAddProduct;
