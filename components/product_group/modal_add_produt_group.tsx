import { TitleModal } from "@/components/_title_modal";
import { BackDropView } from "@/components/back_drop_view";
import { ModalContainer } from "@/components/modal_container";
import ApiConst from "@/const/ApiConst";
import { ActionType } from "@/enum/ActionType";
import { DiaryStatus } from "@/enum/DiaryStatus";
import { IconType } from "@/enum/IconType";
import { INhatKyThaoTacDto } from "@/services/nhat_ky_su_dung/INhatKyThaoTacDto";
import NhatKyThaoTacService from "@/services/nhat_ky_su_dung/NhatKyThaoTacService";
import { IProductGroupDto } from "@/services/product_group/dto";
import ProductGroupSevice from "@/services/product_group/ProductGroupSevice";
import { useAppContext } from "@/store/react_context/AppProvider";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { Button, Icon, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextFieldCustom } from "../text_filed_custom";
import ModalListProductGroup from "./list_group_product";

const ModalAddProductGroup = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<IProductGroupDto>) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const [giaBan, setGiaBan] = useState("");
  const [isShowModalListProductGroup, setIsShowModalListProductGroup] =
    useState(false);
  const [errors, setErrors] = useState({ tenNhomHang: "" });
  const [objProductGroup, setObjProductGroup] = useState<IProductGroupDto>({
    id: ApiConst.GUID_EMPTY,
    tenNhomHang: "",
    thuTuHienThi: 0,
  });

  useEffect(() => {
    if (isShow) {
      ResetData();
      setObjProductGroup({
        id: ApiConst.GUID_EMPTY,
        tenNhomHang: "",
        thuTuHienThi: 0,
      });
    }
  }, [isShow]);

  const ResetData = () => {
    setIsSaving(false);
    setGiaBan("");
    setErrors({ tenNhomHang: "" });
  };

  const showModalProductGroup = () => {
    setIsShowModalListProductGroup(true);
  };

  const checkSave = async () => {
    let errors = {
      tenNhomHang: "",
    };

    if (CommonFunc.checkNull(objProductGroup?.tenNhomHang)) {
      errors.tenNhomHang = "Vui lòng nhập tên nhóm";
    }
    setErrors({ tenNhomHang: errors.tenNhomHang });

    return CommonFunc.checkNull(errors?.tenNhomHang);
  };

  const onSaveProduct = async () => {
    const check = await checkSave();
    if (!check) {
      return false;
    }
    setIsSaving(true);

    if (isSaving) return;

    if (objProductGroup) {
      objProductGroup.tenNhomHang_KhongDau = CommonFunc.convertString_toEnglish(
        objProductGroup?.tenNhomHang ?? ""
      );
      const result = await ProductGroupSevice.CreateNhomHangHoa(
        objProductGroup
      );
      console.log("input ", result);
      if (result) {
        const diary: INhatKyThaoTacDto = {
          idChiNhanh: chiNhanhCurrent?.id ?? "",
          loaiNhatKy: DiaryStatus.INSERT,
          chucNang: "Danh mục nhóm sản phẩm",
          noiDung: `Thêm mới nhóm sản phẩm '${objProductGroup?.tenNhomHang}`,
          noiDungChiTiet: `Thêm mới nhóm sản phẩm '${
            objProductGroup?.tenNhomHang
          }  <br />- Nhóm cha: ${CommonFunc.formatNumbertInput(giaBan)}
             <br />- Thứ tự hiển thị: ${objProductGroup?.thuTuHienThi ?? ""}`,
        };
        await NhatKyThaoTacService.CreateNhatKyHoatDong(diary);
        onSave(result, ActionType.INSERT);
      }
    }

    setIsSaving(false);
  };

  const onChoseProductGroup = async (item: IProductGroupDto) => {
    setObjProductGroup({
      ...objProductGroup,
      idParent: item.id,
      tenNhomCha: item?.tenNhomHang,
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
            title="Nhóm sản phẩm mới"
            onClose={onClose}
            style={{ backgroundColor: theme.colors.primary }}
          />

          <View style={{ gap: 8, padding: 16 }}>
            <TextFieldCustom
              label="Tên nhóm"
              variant="outlined"
              onChangeText={(txt) => {
                setObjProductGroup({ ...objProductGroup, tenNhomHang: txt });
                setErrors({ tenNhomHang: "" });
              }}
              value={objProductGroup?.tenNhomHang ?? ""}
              error={
                CommonFunc.checkNull(errors?.tenNhomHang ?? "") ? false : true
              }
              helperText={errors?.tenNhomHang}
            />
            <TouchableOpacity
              onPress={showModalProductGroup}
              style={{ marginTop: 12 }}
            >
              <TextFieldCustom
                label="Nhóm cha"
                variant="outlined"
                value={objProductGroup?.tenNhomCha ?? "Chọn nhóm"}
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

            <Text>Thứ tự hiển thị</Text>
            <TextInput
              keyboardType="numeric"
              value={(objProductGroup?.thuTuHienThi ?? 0).toString()}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                padding: 12,
                fontSize: 16,
                color: "black",
                textAlign: "right",
              }}
              onChangeText={(txt) =>
                setObjProductGroup({
                  ...objProductGroup,
                  thuTuHienThi: CommonFunc.formatNumberToFloat(txt),
                })
              }
            />

            <View style={{ paddingTop: 20, gap: 8 }}>
              <Button radius={"md"} onPress={onSaveProduct}>
                Thêm mới
              </Button>
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalAddProductGroup;
