import ApiConst from "@/const/ApiConst";
import { ActionType } from "@/enum/ActionType";
import CustomerGroupService from "@/services/customer_group/CustomerGroupService";
import { ICustomerGroupDto } from "@/services/customer_group/ICustomerGroupDto";
import { PropModal } from "@/type/PropModal";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, View } from "react-native";
import * as yup from "yup";
import { TitleModal } from "../_title_modal";
import { BackDropView } from "../back_drop_view";
import { ModalContainer } from "../modal_container";
import { TextFieldCustom } from "../text_filed_custom";

const ModalAddNhomKhachHang = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<ICustomerGroupDto>) => {
  const { theme } = useTheme();
  const schema = yup.object({
    tenNhomKhach: yup.string().required("Vui lòng nhập tên nhóm khách"),
  });

  type FormData = yup.InferType<typeof schema>;
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const saveNhomKhach = async (data: FormData) => {
    const check = await CustomerGroupService.checkGroupNameExists(
      data?.tenNhomKhach,
      objUpdate?.id ?? ""
    );
    if (check) {
      setError("tenNhomKhach", {
        type: "manual",
        message: "Tên nhóm khách đã tồn tại",
      });
      return false;
    }
    const input: ICustomerGroupDto = {
      id: objUpdate?.id ?? ApiConst.GUID_EMPTY,
      tenNhomKhachHang: data?.tenNhomKhach,
    };
    const result = await CustomerGroupService.CreateOrEditNhomKhach(input);
    if (result) {
      onSave(result, ActionType.INSERT);
    }
  };

  return (
    <Modal visible={isShow} transparent animationType="slide">
      <BackDropView
        style={{
          justifyContent: "flex-start",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <ModalContainer>
          <TitleModal
            title="Thêm nhóm khách"
            onClose={onClose}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ padding: 16 }}>
            <Controller
              name="tenNhomKhach"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextFieldCustom
                  label="Tên nhóm khách"
                  variant="outlined"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors?.tenNhomKhach ?? false ? true : false}
                  helperText={errors.tenNhomKhach?.message}
                />
              )}
            />
            <View style={{ justifyContent: "flex-end", marginTop: 16 }}>
              <Button onPress={handleSubmit(saveNhomKhach)} radius={"md"}>
                Lưu
              </Button>
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalAddNhomKhachHang;

const style = StyleSheet.create({
  modalContainer: {},
});
