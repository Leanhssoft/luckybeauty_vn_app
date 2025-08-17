import { TitleModal } from "@/components/_title_modal";
import { BackDropView } from "@/components/back_drop_view";
import { ModalContainer } from "@/components/modal_container";
import ApiConst from "@/const/ApiConst";
import { ActionType } from "@/enum/ActionType";
import { DiaryStatus } from "@/enum/DiaryStatus";
import { IconType } from "@/enum/IconType";
import { INhatKyThaoTacDto } from "@/services/nhat_ky_su_dung/INhatKyThaoTacDto";
import NhatKyThaoTacService from "@/services/nhat_ky_su_dung/NhatKyThaoTacService";
import { IProductBasic, ProductBasicDto } from "@/services/product/dto";
import ProductService from "@/services/product/ProductService";
import { IProductGroupDto } from "@/services/product_group/dto";
import { useAppContext } from "@/store/react_context/AppProvider";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { Button, Icon, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NumericFormat } from "react-number-format";
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
  const [isShowModalListProductGroup, setIsShowModalListProductGroup] =
    useState(false);
  const [errors, setErrors] = useState({ maHangHoa: "", tenHangHoa: "" });
  const [objProduct, setObjProduct] = useState<ProductBasicDto>(
    new ProductBasicDto({ idDonViQuyDoi: "" })
  );

  useEffect(() => {
    console.log("isShow ", isShow);
    if (isShow) {
      setIsSaving(false);
      //setObjProduct(new ProductBasicDto({ idDonViQuyDoi: "" }));
    }
  }, [isShow]);

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
        errors.maHangHoa = "Mã hàg hóa đã tồn tại";
      }
    }

    if (CommonFunc.checkNull(objProduct?.tenHangHoa)) {
      errors.tenHangHoa = "Vui lòng nhập tên hàng hóa";
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

    const result = await ProductService.CreateOrOEdit(objProduct);
    setIsSaving(false);

    if (result) {
      const diary: INhatKyThaoTacDto = {
        idChiNhanh: chiNhanhCurrent?.id ?? "",
        loaiNhatKy: DiaryStatus.INSERT,
        chucNang: "Danh mục sản phẩm",
        noiDung: `Thêm mới sản phẩm '${result?.tenHangHoa} (${result?.maHangHoa})`,
        noiDungChiTiet: `Thêm mới sản phẩm '${result?.tenHangHoa} (${result?.maHangHoa}) <br />- Giá bán: ${objProduct.giaBan}
         <br />- Nhóm sản phẩm: ${objProduct.tenNhomHang}`,
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
      <BackDropView>
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
              label="Mã hàng hóa"
              variant="outlined"
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
              label="Tên hàng hóa"
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

            <NumericFormat
              value={objProduct.giaBan}
              thousandSeparator={"."}
              decimalSeparator={","}
              decimalScale={4}
              customInput={TextFieldCustom}
              onChange={(txt) =>
                setObjProduct({
                  ...objProduct,
                  giaBan: CommonFunc.formatNumberToFloat(txt),
                })
              }
            />

            <TouchableOpacity onPress={showModalProductGroup}>
              <TextFieldCustom
                label="Nhóm sản phẩm"
                variant="outlined"
                value={objProduct?.idNhomHangHoa ?? ""}
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
