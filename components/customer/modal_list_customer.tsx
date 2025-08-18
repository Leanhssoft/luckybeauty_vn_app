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
import { ActivityIndicator, FlatList, Modal, StyleSheet } from "react-native";
import { CustomerItem } from "./_customer_item";

export default function ModalListCustomer({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<IKhachHangItemDto>) {
  const firstLoad = useRef(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [txtSearch, setTxtSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [lstCustomer, setLstCustomer] = useState<IKhachHangItemDto[]>([]);

  const jqAutoCustomer = async (param: IPagedKhachHangRequestDto) => {
    if (isLoading) return;
    setIsLoading(true);
    const lst = await KhachHangService.jqAutoCustomer(param);

    if ((lst?.length ?? 0) === 0) {
      setHasMore(false);
    }

    if (param.skipCount === 0) {
      setLstCustomer([...lst]);
    } else {
      setLstCustomer((prev) => {
        return [...prev, ...lst];
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isShow) {
      setCurrentPage(0);
      const param: IPagedKhachHangRequestDto = {
        keyword: "",
        skipCount: 0,
        maxResultCount: 10,
      };
      jqAutoCustomer(param);
    }
  }, [isShow]);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setCurrentPage(0);
    const getData = setTimeout(async () => {
      const param: IPagedKhachHangRequestDto = {
        keyword: txtSearch,
        skipCount: 0,
        maxResultCount: 10,
      };
      await jqAutoCustomer(param);
    }, 2000);
    return () => clearTimeout(getData);
  }, [txtSearch]);

  const choseCustomer = (item: IKhachHangItemDto) => {
    onSave(item);
  };

  const handleLoadMore = async () => {
    if (hasMore) {
      setCurrentPage(() => currentPage + 1);
      const param: IPagedKhachHangRequestDto = {
        keyword: txtSearch,
        skipCount: currentPage + 1,
        maxResultCount: 10,
      };
      await jqAutoCustomer(param);
    }
  };
  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="small" />;
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
          />
          <FlatList
            data={lstCustomer}
            renderItem={({ item }) => (
              <CustomerItem item={item} choseCustomer={choseCustomer} />
            )}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
          />
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searchBarConatiner: {
      backgroundColor: theme.colors.white,
    },
    modalContainer: {
      height: "100%",
      flex: 1,
    },
  });
