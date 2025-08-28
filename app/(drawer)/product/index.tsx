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
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

import ModalAddProductGroup from "@/components/product_group/modal_add_produt_group";
import { ActionType } from "@/enum/ActionType";
import {
  default as Animated,
  Easing,
  default as Reanimated,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalAddProduct from "../../../components/product/modal_add_product";

interface IPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ProductItemProps = {
  item: IProductBasic;
  onLongPress: (ref: View, item: IProductBasic) => void;
};

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
    console.log("GetListProduct ", param);

    // console.log("param ", param);
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
          items: [
            ...prev.items,
            ...newData.filter(
              (x) =>
                !prev.items.some((y) => y.idDonViQuyDoi === x.idDonViQuyDoi)
            ),
          ],
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

  const showConfirmDelete = (itemChosed?: IProductBasic) => {
    let tenHangHoa = "";
    if (itemChosed) {
      tenHangHoa = itemChosed?.tenHangHoa ?? "";
    } else {
      tenHangHoa = productChosed?.tenHangHoa ?? "";
    }
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: `Bạn có chắc chắn muốn xóa sản phẩm ${tenHangHoa} không?`,
    });
  };

  const handleLoadMore = () => {
    setCurrentPage(() => currentPage + 1);
  };

  const [position, setPosition] = useState<IPosition | null>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const scale = useSharedValue(1);
  const cloneOpacity = useSharedValue(1);
  const overlayOpacity = useSharedValue(0);
  const actionOpacity = useSharedValue(0);
  const actionTranslateY = useSharedValue(-10);

  // action style
  const actionStyle = useAnimatedStyle(() => ({
    opacity: actionOpacity.value,
    transform: [{ translateY: actionTranslateY.value }],
  }));

  const onLongPressProduct = (ref: View, item: IProductBasic) => {
    ref.measureInWindow((x, y, width, height) => {
      setPosition({ x, y, width, height });
      setProductChosed(item);

      // start animation
      cloneOpacity.value = 1;
      scale.value = withTiming(1.05, { duration: 180 });
      overlayOpacity.value = withTiming(0.5, { duration: 180 });

      actionOpacity.value = withTiming(1, { duration: 200 });
      actionTranslateY.value = withTiming(0, { duration: 200 });
    });
  };

  const onPressOutProduct = () => {
    // scale item về 1
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
    overlayOpacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });

    // action menu ẩn
    actionOpacity.value = withTiming(0, { duration: 120 });
    actionTranslateY.value = withTiming(-10, { duration: 120 });

    // Ẩn clone item mượt
    cloneOpacity.value = withTiming(
      0,
      { duration: 150, easing: Easing.out(Easing.quad) },
      () => {
        runOnJS(setProductChosed)(null);
        runOnJS(setPosition)(null);
      }
    );
  };

  // overlay style
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // clone item style
  const cloneStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: cloneOpacity.value,
  }));

  const showModalAddNewProduct = () => {
    setIsShowShowModalAddProduct(true);
    setProductChosed(null);
  };
  const showModalUpdatewProduct = () => {
    setIsShowShowModalAddProduct(true);
  };

  const showModalAddNew_ProductGroup = () => {
    setIsShowModalAdd_ProductGroup(true);
  };

  const saveOKProductGroup = (item: IProductGroupDto) => {
    setIsShowModalAdd_ProductGroup(false);
    setListGroupProduct([item, ...listGroupProduct]);
  };

  const deleteProduct = async () => {
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

  const saveOKProuduct = (item: IProductBasic, btnRightActionid?: number) => {
    setIsShowShowModalAddProduct(false);
    switch (btnRightActionid ?? 0) {
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
    drag: SharedValue<number>,
    item: IProductBasic
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 140 }],
      };
    }, []);

    return (
      <Reanimated.View style={[styleAnimation, { flexDirection: "row" }]}>
        <TouchableOpacity
          style={[
            styles.btnRightAction,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => {
            setProductChosed(item);
            showModalUpdatewProduct();
          }}
        >
          <Icon
            name="note-edit"
            type={IconType.MATERIAL_COMMUNITY}
            color={theme.colors.white}
            size={18}
          />
          <Text style={styles.btnRightActionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnRightAction,
            { backgroundColor: theme.colors.error },
          ]}
          onPress={() => {
            setProductChosed(item);
            showConfirmDelete(item);
          }}
        >
          <Icon
            name="delete"
            type={IconType.MATERIAL_COMMUNITY}
            color={theme.colors.white}
            size={18}
          />
          <Text style={styles.btnRightActionText}>Xóa</Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

  const ProductItem = ({ item, onLongPress }: ProductItemProps) => {
    const swipeableRef = useRef<SwipeableMethods | null>(null);
    const itemRef = useRef<View>(null); // ref riêng cho mỗi item
    const { theme } = useTheme();
    return (
      <Swipeable
        friction={2}
        dragOffsetFromRightEdge={100}
        renderRightActions={(progress, drag) =>
          RightAction(progress, drag, item)
        }
        containerStyle={{ overflow: "hidden" }}
        onSwipeableOpen={() => {
          if (openRef.current && openRef.current !== swipeableRef.current) {
            openRef.current.close();
          }
          openRef.current = swipeableRef.current;
        }}
        ref={swipeableRef}
        onSwipeableClose={() => {
          if (openRef.current === swipeableRef.current) {
            openRef.current = null;
          }
        }}
      >
        <Pressable
          style={styles.productItem}
          onLongPress={() => {
            if (itemRef.current) {
              onLongPress(itemRef.current, item);
            }
          }}
        >
          <View style={[styles.flexRow, styles.contentItem]} ref={itemRef}>
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
        </Pressable>
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
            renderItem={({ item }) => (
              <ProductItem item={item} onLongPress={onLongPressProduct} />
            )}
            keyExtractor={(item) => item.idDonViQuyDoi}
            onEndReachedThreshold={0.1}
            onEndReached={handleLoadMore}
          />
        )}
        {productChosed && position && (
          <>
            {/* Overlay mờ */}
            <Animated.View
              style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
              pointerEvents="auto"
            >
              {/* bắt sự kiện tap ngoài clone */}
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={onPressOutProduct}
              />
            </Animated.View>

            {/* Item nổi bật */}
            <Animated.View
              style={[
                styles.itemClone,
                {
                  top: position.y - 74,
                  left: position.x,
                  width: position.width,
                },
                cloneStyle,
              ]}
            >
              <View style={[styles.flexRow, styles.contentItem]}>
                <View style={{ gap: 4 }}>
                  <Text>{productChosed.tenHangHoa}</Text>
                  <Text
                    style={{
                      color: theme.colors.success,
                    }}
                  >
                    {productChosed.maHangHoa}
                  </Text>
                </View>
                <Text
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {new Intl.NumberFormat("vi-VN").format(productChosed.giaBan)}
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.actionMenu,
                {
                  left: position.x,
                  top: position.y + position.height - 50,
                },
                actionStyle,
              ]}
            >
              <TouchableOpacity
                style={[styles.flexRow, styles.dropdownItemAction]}
                onPress={showModalUpdatewProduct}
              >
                <Icon
                  name="note-edit-outline"
                  type={IconType.MATERIAL_COMMUNITY}
                  size={18}
                />
                <Text>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.flexRow,
                  styles.dropdownItemAction,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.grey5,
                  },
                ]}
                onPress={() => showConfirmDelete}
              >
                <Icon
                  name="delete-outline"
                  type={IconType.MATERIAL_COMMUNITY}
                  size={18}
                />
                <Text>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flexRow, styles.dropdownItemAction]}
                onPress={() => setIsCheckMultipleProduct(true)}
              >
                <Icon
                  name="check"
                  type={IconType.MATERIAL_COMMUNITY}
                  size={18}
                />
                <Text>Chọn nhiều</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </View>
      <BottomButtonAdd onPress={showModalAddNewProduct} />

      {/* <ActionBottomNew visible={true}>
        <View>
          <Text>hi btnRightAction</Text>
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
    btnRightAction: {
      justifyContent: "center",
      height: "100%",
      width: 70,
      gap: 4,
    },
    btnRightActionText: {
      textAlign: "center",
      color: theme.colors.white,
      fontSize: 14,
    },
    dropdownItemAction: {
      padding: 8,
      gap: 4,
    },
    overlay: {
      backgroundColor: theme.colors.black,
    },
    itemClone: {
      position: "absolute",
      backgroundColor: theme.colors.white,
      borderRadius: 8,
      elevation: 6,
      padding: 10,
      zIndex: 10,
    },
    actionMenu: {
      position: "absolute",
      backgroundColor: theme.colors.white,
      padding: 10,
      borderRadius: 8,
      elevation: 5,
      shadowColor: theme.colors.background,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      zIndex: 15,
      gap: 8,
    },
  });
