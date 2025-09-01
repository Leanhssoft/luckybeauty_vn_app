import ApiConst from "@/const/ApiConst";
import AppConst from "@/const/AppConst";
import { ActionType } from "@/enum/ActionType";
import { IconType } from "@/enum/IconType";
import { LoaiDoiTuong } from "@/enum/LoaiDoiTuong";
import {
  CreateOrEditKhachangDto,
  ICreateOrEditKhachHangDto,
} from "@/services/customer/ICreateOrEditKhachHangDto";
import KhachHangService from "@/services/customer/KhachHangService";
import { ICustomerGroupDto } from "@/services/customer_group/ICustomerGroupDto";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button, Icon } from "@rneui/base";
import { Text, Theme, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import Radio from "../_radio";
import { TextLink } from "../_text_link";
import { TitleModal } from "../_title_modal";
import { BackDropView } from "../back_drop_view";
import { ModalContainer } from "../modal_container";
import ModalListCustomerGroup from "../nhom_khach_hang/modal_list_customer_group";
import { TextFieldCustom } from "../text_filed_custom";

const ModalAddCustomer = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<ICreateOrEditKhachHangDto>) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const isNewCustomer = CommonFunc.checkNull(objUpdate?.id);

  const [isShowModalListCustomer, setIsShowModalListCustomer] = useState(false);
  const [isShowDateWheel, setIsShowDateWheel] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  const schema = yup.object({
    tenKhachHang: yup.string().required("Vui lòng nhập tên khách hàng"),
    soDienThoai: yup.string().min(9).matches(AppConst.PHONE_REGX, {
      message: "Số điện thoại không hợp lệ",
      excludeEmptyString: true,
    }),
  });

  type UserFormData = InstanceType<typeof CreateOrEditKhachangDto>;
  type ValidatedFields = yup.InferType<typeof schema>; // Chỉ validate cho 1 số field
  type FormData = ValidatedFields & UserFormData;
  const defaultValues = new CreateOrEditKhachangDto({
    id: "",
    tenKhachHang: "",
    soDienThoai: "",
    gioiTinhNam: false,
    diaChi: "",
    ngaySinh: null,
    tenNhomKhach: "Chọn nhóm",
  });

  useEffect(() => {
    if (isShow) {
      if (isNewCustomer) {
        reset(defaultValues);
      } else {
        // cập nhật
        reset({
          ...defaultValues,
          ...objUpdate,
        });
        if (objUpdate?.ngaySinh) {
          setDateOfBirth(new Date(objUpdate?.ngaySinh ?? new Date()));
        } else {
          setDateOfBirth(null);
        }
      }
    }
  }, [isShow]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver<FormData, any, FormData>(
      schema as yup.ObjectSchema<FormData>
    ),
    defaultValues: defaultValues,
    shouldUnregister: false,
  });

  const showDateWheel = () => {
    setIsShowDateWheel(true);
  };

  const choseDateOfBirth = (event: DateTimePickerEvent, date?: Date) => {
    setDateOfBirth(date ?? new Date());
    setValue("ngaySinh", date ?? null);
    if (Platform.OS === "android") {
      setIsShowDateWheel(false);
    }
  };

  const onDoneChoseDateOfBirth = () => {
    setIsShowDateWheel(false);
  };
  const cancelChoseDateOfBirth = () => {
    setIsShowDateWheel(false);
    if (isNewCustomer) {
      setDateOfBirth(null);
    } else {
      if (objUpdate?.ngaySinh) {
        setDateOfBirth(new Date(objUpdate?.ngaySinh ?? new Date()));
      } else {
        setDateOfBirth(null);
      }
    }
  };

  const showModalNhomKhach = () => {
    setIsShowModalListCustomer(true);
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
    const check = await checkSave(data);
    if (!check) {
      return false;
    }
    data.idLoaiKhach = LoaiDoiTuong.KHACH_HANG;
    data.tenKhachHang_KhongDau = CommonFunc.convertString_toEnglish(
      data?.tenKhachHang
    );
    const result = await KhachHangService.createOrEdit(data);
    result.tenNhomKhach = CommonFunc.checkNull(result.tenNhomKhach ?? "")
      ? "Nhóm mặc định"
      : result.tenNhomKhach;

    if (result !== null) {
      onSave(result, isNewCustomer ? ActionType.INSERT : ActionType.UPDATE);
    }
  };

  const saveOKNhomKhach = async (
    nhomKhach: ICustomerGroupDto,
    actionid?: number
  ) => {
    if (CommonFunc.checkNull_OrEmpty(nhomKhach?.id)) {
      setValue("idNhomKhach", null);
    } else {
      setValue("idNhomKhach", nhomKhach?.id);
    }
    setValue("tenNhomKhach", nhomKhach?.tenNhomKhach);
    setIsShowModalListCustomer(false);
  };

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <ModalListCustomerGroup
        isShow={isShowModalListCustomer}
        objUpdate={{
          id: watch("idNhomKhach") ?? ApiConst.GUID_EMPTY,
          tenNhomKhach: watch("tenNhomKhach") ?? "Nhóm mặc định",
        }}
        onClose={() => setIsShowModalListCustomer(false)}
        onSave={saveOKNhomKhach}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackDropView>
          <ModalContainer
            style={{
              position: "relative",
            }}
          >
            <TitleModal
              title={isNewCustomer ? "Khách hàng mới" : "Cập nhật khách hàng"}
              onClose={onClose}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <KeyboardAvoidingView>
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
                <Text>Ngày sinh</Text>
                {}
                <TouchableOpacity onPress={showDateWheel}>
                  {dateOfBirth ? (
                    <Text
                      style={{
                        padding: 12,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: theme.colors.grey5,
                      }}
                    >
                      {dayjs(watch("ngaySinh") ?? new Date()).format(
                        "DD/MM/YYYY"
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        padding: 12,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: theme.colors.grey5,
                      }}
                    >
                      {""}
                    </Text>
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <Text>Giới tính</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
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
                <TouchableOpacity onPress={showModalNhomKhach}>
                  <TextFieldCustom
                    label="Nhóm khách"
                    variant="outlined"
                    value={watch("tenNhomKhach") || "Nhóm mặc định"}
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
                  <Button radius={"md"} onPress={handleSubmit(onSaveCustomer)}>
                    {isNewCustomer ? "Thêm mới" : "Cập nhật"}
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
                  <View style={[styles.datetime_boxDone]}>
                    <TextLink lable="Hủy" onPress={cancelChoseDateOfBirth} />
                    <TextLink lable="Xong" onPress={onDoneChoseDateOfBirth} />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <DateTimePicker
                      value={dateOfBirth ?? new Date()}
                      mode="date"
                      display="spinner"
                      onChange={choseDateOfBirth}
                      minimumDate={new Date(1950, 1, 1)}
                      timeZoneName="Asia/Ho_Chi_Minh"
                      locale="vi-VN"
                      is24Hour
                      textColor={theme.colors.black}
                    />
                  </View>
                </View>
              )}
            </KeyboardAvoidingView>
          </ModalContainer>
        </BackDropView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalAddCustomer;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    datetime_boxDone: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingVertical: 8,
    },
  });
