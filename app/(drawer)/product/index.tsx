import BottomButtonAdd from "@/components/_bottom_button_add";
import { ConfirmOKCancel } from "@/components/confirm_ok_cancel";
import PageEmpty from "@/components/page_empty";
import AppConst from "@/const/AppConst";
import { DiaryStatus } from "@/enum/DiaryStatus";
import { IconType } from "@/enum/IconType";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { INhatKyThaoTacDto } from "@/services/nhat_ky_su_dung/INhatKyThaoTacDto";
import NhatKyThaoTacService from "@/services/nhat_ky_su_dung/NhatKyThaoTacService";
import { IParamSearchProductDto, IProductBasic } from "@/services/product/dto";
import ProductService from "@/services/product/ProductService";
import { IProductGroupDto } from "@/services/product_group/dto";
import ProductGroupSevice from "@/services/product_group/ProductGroupSevice";
import { useAppContext } from "@/store/react_context/AppProvider";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import { Theme } from "@rneui/base";
import { Button, Icon, SearchBar, Text, useTheme } from "@rneui/themed";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  findNodeHandle,
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

import ModalAddProductGroup from "@/components/product_group/modal_add_produt_group";
import { ActionType } from "@/enum/ActionType";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalAddProduct from "../../../components/product/modal_add_product";

const Product = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const searchRef = useRef<TextInput | null>(null);
  const openRef = useRef<SwipeableMethods | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const isShowBoxFilter = useSharedValue(false);
  const [isShowBoxSearch, setIsShowBoxSearch] = useState(false);
  const [isShowPopoverAction, setIsShowPopoverAction] = useState(false);
  const [isShowModalAddProduct, setIsShowShowModalAddProduct] = useState(false);
  const [isShowModalAdd_ProductGroup, setIsShowModalAdd_ProductGroup] =
    useState(false);
  const [isCheckMultipleProduct, setIsCheckMultipleProduct] = useState(false);
  const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);
  const [arrIdNhomHangFilter, setArrIdNhomHangFilter] = useState<string[]>([]);
  const [listGroupProduct, setListGroupProduct] = useState<IProductGroupDto[]>(
    []
  );
  const [productChosed, setProductChosed] = useState<IProductBasic | null>(
    null
  );
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();
  const [pageResultProduct, setPageResultProduct] = useState<
    IPageResultDto<IProductBasic>
  >({
    items: [],
    totalCount: 0,
    totalPage: 0,
  });

  const GetAllNhomSanPham = async () => {
    const data = await ProductGroupSevice.GetAllNhomHangHoa();
    setListGroupProduct([...data.items]);
  };

  useEffect(() => {
    GetAllNhomSanPham();
  }, []);

  const GetListProduct = useCallback(async () => {
    const param: IParamSearchProductDto = {
      textSearch: textSearch,
      currentPage: currentPage,
      pageSize: AppConst.PAGE_SIZE,
      idNhomHangHoas: arrIdNhomHangFilter,
    };

    console.log("param ", param);
    const data = await ProductService.GetListproduct(param);
    const newData = data?.items ?? [];

    if (currentPage === 1) {
      setPageResultProduct((prev) => {
        return {
          ...prev,
          items: [...newData],
          totalCount: data?.totalCount,
        };
      });
    } else {
      setPageResultProduct((prev) => {
        return {
          ...prev,
          items: [...prev.items, ...newData],
          totalCount: prev.totalCount ?? 0,
        };
      });
    }
  }, [currentPage, arrIdNhomHangFilter, textSearch]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      setCurrentPage(1);
    }, 2000);
    return () => clearTimeout(getData);
  }, [textSearch]);

  const onShowBoxSearch = () => {
    setIsShowBoxSearch(true);
    setTimeout(() => {
      searchRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    GetListProduct();
  }, [GetListProduct]);

  const nhomHangHoa_clickAll = async () => {
    setArrIdNhomHangFilter([]);
    setCurrentPage(1);
  };

  const choseNhomHangHoa = async (idNhomHang: string) => {
    setArrIdNhomHangFilter([idNhomHang]);
    setCurrentPage(1);
  };

  const showConfirmDelete = () => {
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: `Bạn có chắc chắn muốn xóa sản phẩm ${productChosed?.tenHangHoa} không?`,
    });
    openRef?.current?.close();
  };

  const handleLoadMore = () => {
    setCurrentPage(() => currentPage + 1);
  };

  const dropdownRef = useRef<View>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const showPopoverAction = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        setPosition({ x, y, width, height });
        setIsShowPopoverAction(true);
      });
    }
  };
  const measurePosition = () => {
    const handle = findNodeHandle(dropdownRef.current);
    if (handle) {
      dropdownRef?.current?.measureInWindow((x, y, width, height) => {
        setPosition({ x, y, width, height });
      });
    }
  };

  const onLongPressProduct = (ref: View | null, item: IProductBasic) => {
    ref?.measureInWindow((x, y, width, height) => {
      setPosition({ x, y, width, height });
      setProductChosed(item);
      setIsShowPopoverAction(true);
    });
  };

  const onPressAction = (type: number) => {};

  const arrAction = [
    { id: ActionType.UPDATE, label: "Sửa" },
    { id: ActionType.DELETE, label: "Xóa" },
  ];

  const toggleBoxFilter = () => {
    isShowBoxFilter.value = !isShowBoxFilter.value;
  };

  const showModalAddNewProduct = () => {
    setIsShowShowModalAddProduct(true);
    setProductChosed(null);
    openRef?.current?.close();
  };
  const showModalUpdatewProduct = () => {
    setIsShowShowModalAddProduct(true);
    openRef?.current?.close();
  };

  const showModalAddNew_ProductGroup = () => {
    setIsShowModalAdd_ProductGroup(true);
  };

  const saveOKProductGroup = (item: IProductGroupDto) => {
    setIsShowModalAdd_ProductGroup(false);
    setListGroupProduct([item, ...listGroupProduct]);
  };

  const deleteProduct = async () => {
    console.log("productChosed?.id ", productChosed?.id);
    const deleteOK = await ProductService.DeleteProduct(
      productChosed?.id ?? ""
    );
    if (deleteOK !== null) {
      const diary: INhatKyThaoTacDto = {
        idChiNhanh: chiNhanhCurrent?.id ?? "",
        loaiNhatKy: DiaryStatus.DELETE,
        chucNang: "Danh mục hàng hóa",
        noiDung: `Xóa hàng hóa '  ${productChosed?.tenHangHoa} (${productChosed?.maHangHoa})`,
        noiDungChiTiet: `Xóa hàng hóa '  ${productChosed?.tenHangHoa} (${productChosed?.maHangHoa})`,
      };
      await NhatKyThaoTacService.CreateNhatKyHoatDong(diary);
      setPageResultProduct({
        ...pageResultProduct,
        totalCount: pageResultProduct?.totalCount - 1,
        items: pageResultProduct?.items?.filter(
          (x) => x.idDonViQuyDoi !== productChosed?.idDonViQuyDoi
        ),
      });
    }
    setObjSimpleDialog({ ...objSimpleDialog, isShow: false });
  };

  const saveOKProuduct = (item: IProductBasic, actionid?: number) => {
    setIsShowShowModalAddProduct(false);
    switch (actionid ?? 0) {
      case ActionType.INSERT:
        {
          setPageResultProduct({
            items: [item, ...(pageResultProduct?.items ?? [])],
            totalCount: (pageResultProduct?.totalCount ?? 0) + 1,
            totalPage: 1, // not important
          });
        }
        break;
      case ActionType.UPDATE:
        {
          setPageResultProduct({
            ...pageResultProduct,
            items: pageResultProduct?.items?.map((x) => {
              if (x.idDonViQuyDoi === item.idDonViQuyDoi) {
                return {
                  ...x,
                  maHangHoa: item?.maHangHoa,
                  tenHangHoa: item?.tenHangHoa,
                  tenNhomHang: item?.tenNhomHang,
                  idNhomHangHoa: item?.idNhomHangHoa,
                  giaBan: item?.giaBan,
                };
              } else {
                return x;
              }
            }),
          });
        }
        break;
    }
  };

  function RightAction(
    progress: SharedValue<number>,
    drag: SharedValue<number>
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: progress.value }], // ví dụ
      };
    }, []);

    return (
      <Reanimated.View style={[styleAnimation, { flexDirection: "row" }]}>
        <TouchableOpacity
          style={[styles.action, { backgroundColor: theme.colors.primary }]}
          onPress={showModalUpdatewProduct}
        >
          <Icon
            name="note-edit"
            type={IconType.MATERIAL_COMMUNITY}
            color={theme.colors.white}
            size={18}
          />
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, { backgroundColor: theme.colors.error }]}
          onPress={showConfirmDelete}
        >
          <Icon
            name="delete"
            type={IconType.MATERIAL_COMMUNITY}
            color={theme.colors.white}
            size={18}
          />
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  }
  const productItem = ({ item }: { item: IProductBasic }) => {
    let swipeableRef: SwipeableMethods | null = null;

    return (
      <Swipeable
        friction={2}
        dragOffsetFromRightEdge={100}
        renderRightActions={RightAction}
        containerStyle={{ overflow: "hidden" }}
        onSwipeableOpen={() => {
          setProductChosed({ ...item });
          if (openRef.current && openRef.current !== swipeableRef) {
            openRef.current.close();
          }
          openRef.current = swipeableRef;
        }}
        ref={(ref) => {
          if (ref) swipeableRef = ref;
        }}
        onSwipeableClose={() => {
          if (openRef.current === swipeableRef) {
            openRef.current = null;
          }
        }}
      >
        <RectButton
          style={styles.productItem}
          onLongPress={() => onLongPressProduct(dropdownRef.current, item)}
        >
          <View style={[styles.flexRow, styles.contentItem]}>
            <View style={{ gap: 4 }}>
              <Text>{item.tenHangHoa}</Text>
              <Text
                style={{
                  color: theme.colors.success,
                }}
              >
                {item.maHangHoa}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: 500,
              }}
            >
              {new Intl.NumberFormat("vi-VN").format(item.giaBan)}
            </Text>
          </View>
        </RectButton>
      </Swipeable>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ConfirmOKCancel
        isShow={objSimpleDialog?.isShow ?? false}
        mes={objSimpleDialog?.mes}
        onAgree={deleteProduct}
        onClose={() =>
          setObjSimpleDialog({ ...objSimpleDialog, isShow: false })
        }
      />
      <ModalAddProduct
        isShow={isShowModalAddProduct}
        onClose={() => setIsShowShowModalAddProduct(false)}
        onSave={saveOKProuduct}
        objUpdate={productChosed as unknown as undefined}
      />
      <ModalAddProductGroup
        isShow={isShowModalAdd_ProductGroup}
        onClose={() => setIsShowModalAdd_ProductGroup(false)}
        onSave={saveOKProductGroup}
      />
      <View style={{ padding: 8 }}>
        {isShowBoxSearch ? (
          <SearchBar
            ref={searchRef}
            placeholder="Tìm kiếm sản phẩm"
            platform={Platform.OS === "ios" ? "ios" : "android"}
            searchIcon={{ name: "search", type: IconType.IONICON }}
            clearIcon={{ name: "close", type: IconType.IONICON }}
            containerStyle={{
              backgroundColor: theme.colors.white,
              borderBottomColor: theme.colors.grey5,
              borderBottomWidth: 1,
              height: 44,
              margin: 0,
            }}
            inputContainerStyle={{
              backgroundColor: theme.colors.white,
              height: 32,
            }}
            cancelButtonTitle="Huỷ"
            showCancel
            value={textSearch}
            onChangeText={(txt) => setTextSearch(txt)}
            onCancel={() => setIsShowBoxSearch(false)}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.colors.grey4, fontSize: 13 }}>
              Tổng số {pageResultProduct?.totalCount ?? 0} sản phẩm
            </Text>
            <View style={styles.boxFilter}>
              <Icon
                name="search"
                type={IconType.MATERIAL}
                onPress={onShowBoxSearch}
              />
              {/* <Icon
                name="filter"
                type={IconType.IONICON}
                onPress={toggleBoxFilter}
              /> */}
            </View>
          </View>
        )}

        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontWeight: 600,
                textDecorationLine: "underline",
                paddingTop: isShowBoxSearch ? 16 : 0,
              }}
            >
              Nhóm sản phẩm
            </Text>
            <Icon
              name="add-circle-outline"
              type={IconType.IONICON}
              size={30}
              color={theme.colors.primary}
              onPress={showModalAddNew_ProductGroup}
            />
          </View>

          <ScrollView horizontal style={{ marginTop: 8 }}>
            {(listGroupProduct?.length ?? 0) > 0 && (
              <Button
                containerStyle={{
                  paddingRight: 6,
                  paddingVertical: 6,
                  marginRight: 8,
                }}
                buttonStyle={{
                  borderRadius: 4,

                  backgroundColor:
                    arrIdNhomHangFilter?.length > 0
                      ? theme.colors.disabled
                      : theme.colors.primary,
                }}
                title={"Tất cả"}
                onPress={nhomHangHoa_clickAll}
              ></Button>
            )}

            {listGroupProduct?.map((item) => (
              <Button
                key={item?.id}
                title={item.tenNhomHang}
                containerStyle={{ padding: 6 }}
                buttonStyle={{
                  borderRadius: 4,
                  backgroundColor: arrIdNhomHangFilter?.includes(item?.id)
                    ? theme.colors.primary
                    : theme.colors.disabled,
                }}
                onPress={() => choseNhomHangHoa(item?.id)}
              ></Button>
            ))}
          </ScrollView>
        </View>

        {(pageResultProduct?.totalCount ?? 0) === 0 ? (
          <PageEmpty txt="Chưa có dữ liệu" />
        ) : (
          <FlatList
            data={pageResultProduct?.items}
            renderItem={productItem}
            keyExtractor={(item) => item.idDonViQuyDoi}
            onEndReachedThreshold={0.1}
            onEndReached={handleLoadMore}
          />
        )}
      </View>
      <BottomButtonAdd onPress={showModalAddNewProduct} />

      {/* <ActionBottomNew visible={true}>
        <View>
          <Text>hi action</Text>
        </View>
      </ActionBottomNew> */}
    </View>
  );
};

export default Product;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    boxFilter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
      marginBottom: 12,
    },
    productItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderBottomColor: theme.colors.grey5,
      borderBottomWidth: 1,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    contentItem: {
      flex: 1,
      justifyContent: "space-between",
    },
    action: {
      justifyContent: "center",
      height: "100%",
      width: 70,
      gap: 4,
    },
    actionText: {
      textAlign: "center",
      color: theme.colors.white,
      fontSize: 14,
    },
  });
