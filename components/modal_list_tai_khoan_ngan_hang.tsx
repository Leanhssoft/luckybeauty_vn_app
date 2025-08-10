import { IconType } from "@/enum/IconType";
import { ITaiKhoanNganHangDto } from "@/services/tai_khoan_ngan_hang/ITaiKhoanNganHangDto";
import TaiKhoanNganHangService from "@/services/tai_khoan_ngan_hang/TaiKhoanNganHangService";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { Text, Theme } from "@rneui/base";
import { Button, Icon, SearchBar, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { TitleModal } from "./_title_modal";
import { BackDropView } from "./back_drop_view";
import { ModalContainer } from "./modal_container";

export const Modal_ListTaiKhoanNganHang = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<ITaiKhoanNganHangDto>) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [txtSearch, setTextSearch] = useState("");
  const [accountBankChosed, setAccountBankChosed] =
    useState<ITaiKhoanNganHangDto>();
  const [listBankAccountSearch, setListBankAccountSearch] = useState<
    ITaiKhoanNganHangDto[]
  >([]);
  const [listBankAccount, setListBankAccount] = useState<
    ITaiKhoanNganHangDto[]
  >([
    {
      id: "1",
      idNganHang: "2",
      tenChuThe: "NGUYEN THI QUYNH NGA",
      soTaiKhoan: "012345678945613",
      logoNganHang: "https://api.vietqr.io/img/KEBHANAHN.png",
    },
    {
      id: "2",
      idNganHang: "1",
      tenChuThe: "LE THI HUONG GIANG",
      soTaiKhoan: "012345678945613",
      logoNganHang: "https://api.vietqr.io/img/SEAB.png",
    },
    {
      id: "3",
      idNganHang: "2",
      tenChuThe: "HOANG CAM LY",
      soTaiKhoan: "012345678945613",
      logoNganHang: "https://api.vietqr.io/img/KEBHANAHN.png",
    },
  ]);

  useEffect(() => {
    setAccountBankChosed(undefined);
  }, [isShow]);

  const getAllBankAccount = async () => {
    const data = await TaiKhoanNganHangService.GetAllBankAccount();
    if (data?.length > 0) {
      setListBankAccount([...data]);
      setListBankAccountSearch([...data]);
    } else {
      setListBankAccount([...listBankAccount]);
      setListBankAccountSearch([...listBankAccount]);
    }
  };

  useEffect(() => {
    getAllBankAccount();
  }, []);

  const searchTaiKhoan = (txt: string) => {
    setTextSearch(txt);
    const str = CommonFunc.convertString_toEnglish(txt);
    const arr = listBankAccount?.filter(
      (x) =>
        CommonFunc.convertString_toEnglish(x.tenChuThe).includes(str) ||
        CommonFunc.convertString_toEnglish(x.soTaiKhoan).includes(str)
      // CommonFunc.convertString_toEnglish(x.tenNganHang).includes(str)  ||
    );
    setListBankAccountSearch(arr);
  };

  const choseTaiKhoanNganHang = (item: ITaiKhoanNganHangDto) => {
    setAccountBankChosed(item);
  };

  const agreeChoseTaiKhoanNganHang = () => {
    if (accountBankChosed) {
      onSave(accountBankChosed);
    }
  };

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <BackDropView>
        <ModalContainer style={styles.modalContainer}>
          <TitleModal title="Chọn tài khoản ngân hàng" onClose={onClose} />
          <SearchBar
            placeholder="Tìm kiếm"
            containerStyle={{
              paddingLeft: 16,
              paddingRight: 16,
              borderTopWidth: 0,
              paddingBottom: 0,
              backgroundColor: theme.colors.white,
            }}
            inputContainerStyle={{
              backgroundColor: theme.colors.white,
            }}
            value={txtSearch}
            onChangeText={(text) => searchTaiKhoan(text)}
          />

          <ScrollView
            style={{
              padding: 16,
            }}
          >
            {listBankAccountSearch?.map((item) => (
              <Pressable
                key={item?.id}
                style={[styles.accountItem]}
                onPress={() => choseTaiKhoanNganHang(item)}
              >
                {accountBankChosed?.id === item.id && (
                  <Icon
                    type={IconType.IONICON}
                    name="checkmark"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
                <Image
                  style={styles.image}
                  source={{ uri: item?.logoNganHang }}
                />

                <View>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 18,
                      textAlign: "center",
                    }}
                  >
                    {item?.tenChuThe ?? ""}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.grey4,
                      textAlign: "center",
                    }}
                  >
                    {item?.soTaiKhoan ?? ""}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.button}>
            <View
              style={{
                gap: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                title={"Bỏ qua"}
                color={theme.colors.error}
                size="lg"
                onPress={onClose}
                containerStyle={{
                  borderRadius: 4,
                }}
              />
              <Button
                title={"Đồng ý"}
                size="lg"
                containerStyle={{
                  borderRadius: 4,
                }}
                onPress={agreeChoseTaiKhoanNganHang}
              />
            </View>
          </View>
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      height: "100%",
      flex: 1,
      position: "relative",
    },

    accountItem: {
      padding: 10,
      borderRadius: 8,
      borderColor: theme.colors.greyOutline,
      borderWidth: 1,
      position: "relative",
      marginTop: 16,
    },
    image: {
      height: 100,
    },
    button: {
      position: "absolute",
      bottom: 16,
      width: "100%",
      paddingHorizontal: 16,
    },
  });
