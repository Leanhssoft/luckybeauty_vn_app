import AppConst from "@/const/AppConst";
import { IconType } from "@/enum/IconType";
import {
  CreateOrEditKhachangDto,
  ICreateOrEditKhachHangDto,
} from "@/services/customer/ICreateOrEditKhachHangDto";
import KhachHangService from "@/services/customer/KhachHangService";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button, Icon } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import Radio from "../_radio";
import { TextLink } from "../_text_link";
import { TitleModal } from "../_title_modal";
import { BackDropView } from "../back_drop_view";
import { ModalContainer } from "../modal_container";
import { TextFieldCustom } from "../text_filed_custom";

const ModalAddCustomer = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<ICreateOrEditKhachHangDto>) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [isShowDateWheel, setIsShowDateWheel] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());

  const [objCustomer, setObjCustomer] = useState<CreateOrEditKhachangDto>(
    new CreateOrEditKhachangDto({
      id: "",
      tenKhachHang: "",
      soDienThoai: "",
      gioiTinhNam: false,
      diaChi: "",
      ngaySinh: null,
    })
  );

  const schema = yup.object({
    tenKhachHang: yup.string().required("Vui lòng nhập tên khách hàng"),
    soDienThoai: yup.string().matches(AppConst.PHONE_REGX, {
      message: "Số điện thoại không hợp lệ",
      excludeEmptyString: true,
    }),
  });

  type UserFormData = InstanceType<typeof CreateOrEditKhachangDto>;
  type ValidatedFields = yup.InferType<typeof schema>; // Chỉ validate cho 1 số field
  type FormData = ValidatedFields & UserFormData;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver<FormData, any, FormData>(
      schema as yup.ObjectSchema<FormData>
    ),
    defaultValues: objCustomer,
    shouldUnregister: false,
  });

  const showDateWheel = () => {
    setIsShowDateWheel(true);
    //Keyboard.dismiss();
  };

  const choseDateOfBirth = (event: DateTimePickerEvent, date?: Date) => {
    setDateOfBirth(date ?? new Date());
    setIsShowDateWheel(false);
    setValue("ngaySinh", date ?? null);
  };

  const onDoneChoseDateOfBirth = () => {
    setIsShowDateWheel(false);
  };

  const checkSave = async (data: FormData) => {
    if (!CommonFunc.checkNull(data?.soDienThoai)) {
      const existSDT = await KhachHangService.checkExistSoDienThoai(
        data?.soDienThoai,
        data?.id
      );
      if (existSDT) {
        setError("soDienThoai", {
          type: "manual",
          message: "Số điện thoại đã tồn tại",
        });
        return false;
      }
    }
    return true;
  };

  const onSaveCustomer = async (data: FormData) => {
    // const check = await checkSave(data);
    // if (!check) {
    //   return;
    // }
    console.log("onSaveCustomer ", data);
  };

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <BackDropView>
        <ModalContainer
          style={{
            position: "relative",
          }}
        >
          <TitleModal title="Khách hàng mới" onClose={onClose} />
          <View style={{ gap: 8, padding: 16 }}>
            <Controller
              control={control}
              name="tenKhachHang"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextFieldCustom
                  label="Tên khách hàng"
                  variant="outlined"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  onFocus={() => setIsShowDateWheel(false)}
                  error={errors?.tenKhachHang ?? false ? true : false}
                  helperText={errors?.tenKhachHang?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="soDienThoai"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextFieldCustom
                  label="Số điện thoại"
                  variant="outlined"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  onFocus={() => setIsShowDateWheel(false)}
                  error={errors?.soDienThoai ?? false ? true : false}
                  helperText={errors?.soDienThoai?.message}
                />
              )}
            />
            <TextFieldCustom
              label="Ngày sinh"
              variant="outlined"
              value={
                CommonFunc.checkNull(objCustomer?.ngaySinh?.toString())
                  ? ""
                  : dayjs().format("DD/MM/YYYY")
              }
              onFocus={showDateWheel}
              showSoftInputOnFocus={false}
            />

            <View
              style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
            >
              <Text>Giới tính</Text>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Radio
                  label="Nữ"
                  isSelected={!(watch("gioiTinhNam") ?? false)}
                  onPressRdo={() => setValue("gioiTinhNam", false)}
                />
                <Radio
                  label="Nam"
                  isSelected={watch("gioiTinhNam") ?? false}
                  onPressRdo={() => setValue("gioiTinhNam", true)}
                />
              </View>
            </View>

            <TextFieldCustom
              label="Nhóm khách"
              variant="outlined"
              value={objCustomer?.idNhomKhach ?? "Nhóm mặc định"}
              readOnly
              endIcon={
                <Icon name="navigate-next" type={IconType.MATERIAL} size={24} />
              }
            />
            <Controller
              control={control}
              name="diaChi"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextFieldCustom
                  multiline
                  variant="outlined"
                  label="Địa chỉ"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <View style={{ paddingTop: 20, gap: 8 }}>
              <Button radius={"md"} onPress={handleSubmit(onSaveCustomer)}>
                Thêm mới
              </Button>
              <Button radius={"md"} color={"error"}>
                Đóng
              </Button>
            </View>
          </View>
          {isShowDateWheel && (
            <View
              style={{
                backgroundColor: theme.colors.grey5,
                position: "absolute",
                bottom: 0,
                width: "100%",
              }}
            >
              {Platform.OS === "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    padding: 16,
                    justifyContent: "space-between",
                    backgroundColor: theme.colors.grey4,
                  }}
                >
                  <TextLink
                    lable="Hủy"
                    overrideStyles={{ fontWeight: 600 }}
                    onPress={() => setIsShowDateWheel(false)}
                  />
                  <TextLink
                    lable="Xong"
                    overrideStyles={{ fontWeight: 600 }}
                    onPress={onDoneChoseDateOfBirth}
                  />
                </View>
              )}
              <View style={{ alignItems: "center" }}>
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="spinner"
                  onChange={choseDateOfBirth}
                  minimumDate={new Date(1950, 1, 1)}
                  timeZoneName="Asia/Ho_Chi_Minh"
                  is24Hour
                  textColor={theme.colors.black}
                />
              </View>
            </View>
          )}
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

export default ModalAddCustomer;
