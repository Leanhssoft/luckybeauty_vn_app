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
  const [isShowModalListProductGroup, setIsShowModalListProductGroup] =
    useState(false);
  const [errors, setErrors] = useState({ maHangHoa: "", tenHangHoa: "" });
  const [objProduct, setObjProduct] = useState<ProductDto>(
    new ProductDto({ id: ApiConst.GUID_EMPTY })
  );

  useEffect(() => {
    if (isShow) {
      ResetData();
      setObjProduct(new ProductDto({ id: ApiConst.GUID_EMPTY }));
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
      console.log("exists ", exists);
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

    const result = await ProductService.CreateOrOEdit(input);
    console.log("input ", result);

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
      onSave(result, ActionType.INSERT);
    }
  };

  const saveOKProductGroup = async (
    productGroup: IProductGroupDto,
    actionid?: number
  ) => {};

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <BackDropView
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          justifyContent: "flex-start",
        }}
      >
        <ModalContainer
          style={{
            position: "relative",
          }}
        >
          <TitleModal
            title="Sản phẩm mới"
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
                value={objProduct?.tenNhomHang ?? "Chọn nhóm"}
                readOnly
                endIcon={
                  <Icon
                    name="navigate-next"
                    type={IconType.MATERIAL}
                    size={30}
                  />
                }
              />
            </TouchableOpacity>

            <View style={{ paddingTop: 20, gap: 8 }}>
              <Button radius={"md"} onPress={onSaveProduct}>
                Thêm mới sản phẩm
              </Button>
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalAddProduct;
