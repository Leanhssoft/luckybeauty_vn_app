import PageEmpty from "@/components/page_empty";
import { IconType } from "@/enum/IconType";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { IParamSearchProductDto, IProductBasic } from "@/services/product/dto";
import ProductService from "@/services/product/ProductService";
import { IProductGroupDto } from "@/services/product_group/dto";
import ProductGroupSevice from "@/services/product_group/ProductGroupSevice";
import { Text, Theme } from "@rneui/base";
import { Button, Icon, Input, useTheme } from "@rneui/themed";
import { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ItemProductSale } from "./ban_hang/_item_product_sale";

type PropsListProductSale = {
  isLoadData: boolean;
  isDoneAgreeChoseProduct: boolean;
  onClickChoseProduct: (
    arrIdQuyDoiChosed: string[],
    isCheckMultipleProduct?: boolean
  ) => void;
};
const ListProductSale: FC<PropsListProductSale> = ({
  isLoadData,
  isDoneAgreeChoseProduct,
  onClickChoseProduct,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [txtSearchProduct, setTxtSearchProduct] = useState("");
  const [isCheckMultipleProduct, setIsCheckMultipleProduct] = useState(false);
  const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);
  const [arrIdNhomHangFilter, setArrIdNhomHangFilter] = useState<string[]>([]);
  const [listGroupProduct, setListGroupProduct] = useState<IProductGroupDto[]>(
    []
  );

  const [paramSearchProduct, setParamSearchProduct] =
    useState<IParamSearchProductDto>({
      textSearch: "",
      currentPage: 1,
      pageSize: 10,
      idNhomHangHoas: [],
    });
  const [pageResultProduct, setPageResultProduct] = useState<
    IPageResultDto<IProductBasic>
  >({
    items: [],
    totalCount: 0,
    totalPage: 0,
  });

  useEffect(() => {
    if (isDoneAgreeChoseProduct) {
      setArrIdQuyDoiChosed([]);
      setIsCheckMultipleProduct(false);
    }
  }, [isDoneAgreeChoseProduct]);

  const GetAllNhomSanPham = async () => {
    const data = await ProductGroupSevice.GetAllNhomHangHoa();
    // setListGroupProduct([...data.items]);
    setListGroupProduct([]);
  };

  const getListProduct = async (resetPage: boolean = false) => {
    console.log("getListProduct ", isLoading, !hasMore);

    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const param = {
      ...paramSearchProduct,
    };
    param.textSearch = txtSearchProduct;

    const data = await ProductService.GetListproduct(param);
    console.log("paramSearchProduct ", paramSearchProduct);

    // if ((data?.items?.length ?? 0) < (paramSearchProduct?.pageSize ?? 10)) {
    //   setHasMore(false);
    // }
    const newData = data?.items ?? [];
    if (resetPage) {
      setPageResultProduct((prev) => {
        return {
          ...pageResultProduct,
          items: [...newData],
          totalCount: data?.totalCount,
        };
      });
    } else {
      setPageResultProduct((prev) => {
        return {
          ...pageResultProduct,
          items: [...prev.items, ...newData],
          totalCount: data?.totalCount,
        };
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoadData) {
      getListProduct((paramSearchProduct?.currentPage ?? 1) === 1);
    }
  }, [paramSearchProduct]);

  useEffect(() => {
    GetAllNhomSanPham();
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    console.log("txtSearchProduct ", txtSearchProduct);
    const getData = setTimeout(async () => {
      await getListProduct(true);
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearchProduct]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setParamSearchProduct((prev) => {
        {
          return {
            ...prev,
            currentPage: (prev?.currentPage ?? 0) + 1,
          };
        }
      });
    }
  };
  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="small" />;
  };

  const nhomHangHoa_clickAll = () => {
    setArrIdNhomHangFilter([]);
    setParamSearchProduct({ ...paramSearchProduct, idNhomHangHoas: [] });
  };

  const choseNhomHangHoa = async (idNhomHang: string) => {
    setArrIdNhomHangFilter([idNhomHang]);
    setParamSearchProduct(() => {
      return {
        ...paramSearchProduct,
        currentPage: 1,
        pageSize: 10,
        idNhomHangHoas: [idNhomHang],
      };
    });
  };

  const choseProduct = async (item: IProductBasic) => {
    const idQuyDoi = item?.idDonViQuyDoi;
    if (isCheckMultipleProduct) {
      let arr: string[] = [];
      setArrIdQuyDoiChosed((prev) => {
        if (!prev.includes(idQuyDoi)) {
          arr = [idQuyDoi, ...prev];
          return [idQuyDoi, ...prev];
        } else {
          arr = prev.filter((x) => x !== idQuyDoi);
          return prev.filter((x) => x !== idQuyDoi);
        }
      });
      onClickChoseProduct(arr, true);
      return;
    }
    setArrIdQuyDoiChosed([idQuyDoi]);
    onClickChoseProduct([idQuyDoi]);
  };

  const clickBoChonNhieuSanPham = () => {
    setIsCheckMultipleProduct(false);
    setArrIdQuyDoiChosed([]);
    onClickChoseProduct([], false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Input
          errorStyle={{ height: 0 }}
          errorMessage=""
          leftIcon={{
            type: IconType.IONICON,
            name: "search",
            size: 14,
            style: {
              color: theme.colors.greyOutline,
            },
          }}
          rightIcon={{
            type: IconType.IONICON,
            name: "add",
          }}
          placeholder="Tìm kiếm sản phẩm"
          containerStyle={{
            borderColor: theme.colors.greyOutline,
            padding: 0,
          }}
          inputStyle={{
            fontSize: 14,
          }}
          onChangeText={(text) => {
            setTxtSearchProduct(text);
          }}
        />
        {(listGroupProduct?.length ?? 0) > 0 && (
          <View>
            <Text
              style={{
                fontWeight: 600,
                textDecorationLine: "underline",
              }}
            >
              Nhóm sản phẩm
            </Text>

            <ScrollView horizontal style={{ marginTop: 8 }}>
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
        )}
      </View>

      {(pageResultProduct?.totalCount ?? 0) == 0 ? (
        <PageEmpty txt="Chưa có dữ liệu" />
      ) : (
        <View style={{ marginTop: 8 }}>
          <View
            style={[
              styles.flexRow,
              { justifyContent: "space-between", marginHorizontal: 8 },
            ]}
          >
            <TouchableOpacity
              onPress={() => setIsCheckMultipleProduct(!isCheckMultipleProduct)}
              style={styles.flexRow}
            >
              {isCheckMultipleProduct && (
                <Icon type="ionicon" name="checkmark" />
              )}
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: theme.colors.primary,
                }}
              >
                Chọn nhiều sản phẩm
              </Text>
            </TouchableOpacity>
            {isCheckMultipleProduct && (
              <TouchableOpacity onPress={clickBoChonNhieuSanPham}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    color: theme.colors.primary,
                  }}
                >
                  Bỏ chọn nhiều
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={pageResultProduct?.items}
            renderItem={({ item }) => (
              <ItemProductSale
                item={item}
                isShowCheck={isCheckMultipleProduct}
                isChosed={arrIdQuyDoiChosed.includes(item.idDonViQuyDoi)}
                choseItem={choseProduct}
              />
            )}
            keyExtractor={(item) => item.idDonViQuyDoi}
            style={{
              paddingBottom: insets.bottom + 60,
            }}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </View>
  );
};

export default ListProductSale;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      position: "relative",
      padding: 8,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    boxContainer: {
      justifyContent: "space-between",
    },
    textRightIcon: {
      paddingLeft: 8,
    },
    actionMenu: {
      backgroundColor: theme.colors.primary,
      gap: 8,
      padding: 10,
      position: "absolute",
      bottom: 0,
      width: "100%",
      justifyContent: "center",
    },
  });
