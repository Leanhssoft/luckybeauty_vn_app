import { TitleModal } from "@/components/_title_modal";
import { BackDropView } from "@/components/back_drop_view";
import { ModalContainer } from "@/components/modal_container";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import { IPagedKhachHangRequestDto } from "@/services/customer/IPagedKhachHangRequestDto";
import KhachHangService from "@/services/customer/KhachHangService";
import { PropModal } from "@/type/PropModal";
import { Theme } from "@rneui/base";
import { SearchBar, useTheme } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet } from "react-native";
import { CustomerItem } from "./_customer_item";

export default function ModalListCustomer({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<IKhachHangItemDto>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [txtSearch, setTxtSearch] = useState("");
  const firstLoad = useRef(true);

  const [lstCustomer, setLstCustomer] = useState<IKhachHangItemDto[]>([]);

  const jqAutoCustomer = async () => {
    const param: IPagedKhachHangRequestDto = {
      keyword: txtSearch,
      skipCount: 0,
      maxResultCount: 10,
    };
    const lst = await KhachHangService.jqAutoCustomer(param);
    setLstCustomer([...lst]);
  };

  useEffect(() => {
    if (isShow) {
      jqAutoCustomer();
    }
  }, [isShow]);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    const getData = setTimeout(async () => {
      await jqAutoCustomer();
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearch]);

  const choseCustomer = (item: IKhachHangItemDto) => {
    onSave(item);
  };

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <BackDropView>
        <ModalContainer style={styles.modalContainer}>
          <TitleModal title="Chọn khách hàng" onClose={onClose} />

          <SearchBar
            placeholder="Tìm kiếm khách hàng"
            value={txtSearch}
            onChangeText={(text) => setTxtSearch(text)}
            containerStyle={styles.searchBarConatiner}
            inputContainerStyle={{
              backgroundColor: "white",
            }}
            inputStyle={{ fontSize: 14 }}
          />
          <FlatList
            data={lstCustomer}
            renderItem={({ item }) => (
              <CustomerItem item={item} choseCustomer={choseCustomer} />
            )}
            keyExtractor={(item) => item.id}
            // style={{
            //   paddingBottom: 8,
            // }}
          />
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searchBarConatiner: {
      paddingLeft: 16,
      paddingRight: 16,
      borderTopWidth: 0,
      paddingBottom: 0,
      backgroundColor: theme.colors.white,
    },
    modalContainer: {
      height: "100%",
      flex: 1,
    },
  });
