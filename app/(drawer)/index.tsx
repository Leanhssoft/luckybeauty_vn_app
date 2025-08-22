import Popover from "@/components/_popover";
import DateRangePicker from "@/components/date_range_picker";
import PageEmpty from "@/components/page_empty";
import { DateType } from "@/enum/DateType";
import { IconType } from "@/enum/IconType";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  findNodeHandle,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import {
  BarChart,
  barDataItem,
  CurveType,
  LineChart,
  lineDataItem,
} from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TypeTime } from "../../enum/TypeTime";
import { IParamSearchFromToDto } from "../../services/commonDto/IParamSearchFromToDto";
import DashboardService from "../../services/dashboard/DashboardService";
import { useAppContext } from "../../store/react_context/AppProvider";
import ChartsFunc, { ChartAxisConfig } from "../../utils/ChartsFunc";
const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const { chiNhanhCurrent } = useAppContext();
  const idChiNhanhCurrent = chiNhanhCurrent?.id ?? "";
  const [doanhThu, setDoanhThu] = useState(0);
  const [thucThu, setThucThu] = useState(0);
  const [soCuocHen, setSoCuocHen] = useState(0);
  const [soKhachMoi, setSoKhachMoi] = useState(0);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [labelFilterDate, setLabelFilterDate] = useState(
    `Hôm nay, ${dayjs().format("DD/MM/YYYY")}`
  );
  const [dataDoanhThu, setDataDoanhThu] = useState<barDataItem[]>([]);
  const [dataLichHen, setDataLichHen] = useState<lineDataItem[]>([]);
  const [barChartAxistConfig, setBarChartAxistConfig] =
    useState<ChartAxisConfig>();

  const [isShowDropdownDate, setIsShowDropdownDate] = useState(false);
  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownRef = useRef<View>(null);
  const datetimeRef = useRef<View>(null);

  const [paramSearch, setParamSearch] = useState<IParamSearchFromToDto>({
    dateType: DateType.HOM_NAY,
    fromDate: dayjs().format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
    idChiNhanhs: [idChiNhanhCurrent],
  });

  const [doanhThu_ParamFilter, setDoanhThu_ParamFilter] =
    useState<IParamSearchFromToDto>({
      timeType: TypeTime.WEEK,
      fromDate: dayjs().startOf("week").add(-1, "day").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("week").format("YYYY-MM-DD"),
      idChiNhanhs: [idChiNhanhCurrent],
    });
  const [lichHen_ParamFilter, setLichHen_ParamFilter] =
    useState<IParamSearchFromToDto>({
      timeType: TypeTime.WEEK,
      fromDate: dayjs().startOf("week").add(-1, "day").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("week").format("YYYY-MM-DD"),
      idChiNhanhs: [idChiNhanhCurrent],
    });

  const arrFilterButton = [
    { id: TypeTime.WEEK, label: "Tuần" },
    { id: TypeTime.MONTH, label: "Tháng" },
    { id: TypeTime.YEAR, label: "Năm" },
  ];

  const arrDateFilter = [
    { id: DateType.HOM_NAY, label: "Hôm nay" },
    { id: DateType.HOM_QUA, label: "Hôm qua" },
    { id: DateType.THANG_NAY, label: "Tháng này" },
    { id: DateType.THANG_TRUOC, label: "Tháng trước" },
    { id: DateType.TUY_CHON, label: "Tùy chỉnh" },
  ];

  const ThongKeSoLuong = useCallback(async () => {
    const xx = await DashboardService.ThongKeSoLuong(paramSearch);
    if (xx !== null) {
      setDoanhThu(xx.tongDoanhThu);
      setThucThu(xx.tongThucThu);
      setSoCuocHen(xx.tongLichHen);
      setSoKhachMoi(xx.tongKhachHangSinhNhat); //todo
    }
  }, [paramSearch]);

  useEffect(() => {
    ThongKeSoLuong();
  }, [ThongKeSoLuong]);

  const ThongKeLichHen = useCallback(async () => {
    const xx = await DashboardService.ThongKeLichHen(lichHen_ParamFilter);
    const data = xx?.map((x) => {
      return {
        label: x.label,
        value: x.value,
        dataPointText: x.value.toString(),
      } as lineDataItem;
    });
    setDataLichHen([...data]);
  }, [lichHen_ParamFilter]);

  const ThongKeDoanhThu = useCallback(async () => {
    const xx = await DashboardService.ThongKeDoanhThu(doanhThu_ParamFilter);

    const tong = xx.reduce((total, item) => total + item.value, 0);
    setTongDoanhThu(tong);

    let timeThis = "";
    switch (doanhThu_ParamFilter?.timeType) {
      case TypeTime.WEEK:
        {
          timeThis = dayjs().format("D");
          timeThis = "Ngày " + timeThis;
        }
        break;
      case TypeTime.MONTH:
        {
          timeThis = dayjs().format("M");
          timeThis = "Tháng " + timeThis;
        }
        break;
      case TypeTime.YEAR:
        {
          timeThis = dayjs().format("YYYY");
          timeThis = "Năm " + timeThis;
        }
        break;
    }
    if (xx !== undefined) {
      const values = xx?.map((item) => item.value);
      const config = ChartsFunc.getChartAxisConfig(values);
      setBarChartAxistConfig({ ...config });
    }

    const xx2 = xx?.map((x) => {
      if (x.label.includes(timeThis.toString())) {
        return {
          label: x.label,
          value: x.value,
          topLabelComponent: () => (
            <Text style={styles.barCharTtopLabel}>
              {ChartsFunc.formatYLabel(x.value)}
            </Text>
          ),
        } as barDataItem;
      } else {
        return {
          label: x.label,
          value: x.value,
        } as barDataItem;
      }
    });
    setDataDoanhThu([...xx2]);
  }, [doanhThu_ParamFilter]);

  useEffect(() => {
    ThongKeLichHen();
  }, [ThongKeLichHen]);

  useEffect(() => {
    ThongKeDoanhThu();
  }, [ThongKeDoanhThu]); // Chỉ trigger khi filter thực sự thay đổi

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setParamSearch((prev) => {
      return {
        ...prev,
        idChiNhanhs: [idChiNhanhCurrent],
      };
    });
    setDoanhThu_ParamFilter((prev) => ({
      ...prev,
      idChiNhanhs: [idChiNhanhCurrent],
    }));
    setLichHen_ParamFilter((prev) => ({
      ...prev,
      idChiNhanhs: [idChiNhanhCurrent],
    }));
  }, [idChiNhanhCurrent]);

  const PageLoad = async () => {
    //
  };

  useEffect(() => {
    PageLoad();
  }, []);

  const SoLuong_changeTypeTime = (newVal: string) => {
    setIsShowDropdownDate(false);
    switch (newVal) {
      case DateType.HOM_NAY:
        {
          setParamSearch({
            ...paramSearch,
            dateType: newVal,
            fromDate: dayjs().format("YYYY-MM-DD"),
            toDate: dayjs().format("YYYY-MM-DD"),
          });
          setLabelFilterDate(`Hôm nay, ${dayjs().format("DD/MM/YYYY")}`);
        }
        break;
      case DateType.HOM_QUA:
        {
          setParamSearch({
            ...paramSearch,
            dateType: newVal,
            fromDate: dayjs().add(-1, "day").format("YYYY-MM-DD"),
            toDate: dayjs().add(-1, "day").format("YYYY-MM-DD"),
          });
          setLabelFilterDate(
            `Hôm qua, ${dayjs().add(-1, "day").format("DD/MM/YYYY")}`
          );
        }
        break;
      case DateType.TUAN_NAY:
        {
          setParamSearch({
            ...paramSearch,
            dateType: newVal,
            fromDate: dayjs().startOf("week").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("week").format("YYYY-MM-DD"),
          });
          setLabelFilterDate(`Tuần này`);
        }
        break;
      case DateType.TUAN_TRUOC:
        {
          setParamSearch({
            ...paramSearch,
            dateType: newVal,
            fromDate: dayjs()
              .startOf("week")
              .add(-1, "week")
              .format("YYYY-MM-DD"),
            toDate: dayjs().endOf("week").add(-1, "week").format("YYYY-MM-DD"),
          });
          setLabelFilterDate(`Tuần trước`);
        }
        break;
      case DateType.THANG_NAY:
        {
          setParamSearch({
            ...paramSearch,
            dateType: newVal,
            fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
          });
          setLabelFilterDate(
            `Tháng ${dayjs().startOf("month").format("MM/YYYY")}`
          );
        }
        break;
      case DateType.THANG_TRUOC:
        {
          setParamSearch({
            ...paramSearch,
            dateType: newVal,
            fromDate: dayjs()
              .startOf("month")
              .add(-1, "month")
              .format("YYYY-MM-DD"),
            toDate: dayjs()
              .endOf("month")
              .add(-1, "month")
              .format("YYYY-MM-DD"),
          });
          setLabelFilterDate(
            `Tháng ${dayjs()
              .startOf("month")
              .add(-1, "month")
              .format("MM/YYYY")}`
          );
        }
        break;
      case DateType.TUY_CHON:
        {
          setIsShowDateRange(true);
        }
        break;
    }
  };

  const DoanhThu_changeTypeTime = (newVal: number) => {
    switch (newVal) {
      case TypeTime.WEEK:
        {
          setDoanhThu_ParamFilter({
            ...doanhThu_ParamFilter,
            timeType: newVal,
            fromDate: dayjs().startOf("week").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("week").format("YYYY-MM-DD"),
          });
        }
        break;
      case TypeTime.MONTH:
        {
          setDoanhThu_ParamFilter({
            ...doanhThu_ParamFilter,
            timeType: newVal,
            fromDate: dayjs().startOf("year").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
          });
        }
        break;
      case TypeTime.YEAR:
        {
          setDoanhThu_ParamFilter({
            ...doanhThu_ParamFilter,
            timeType: newVal,
            fromDate: dayjs()
              .startOf("year")
              .subtract(-6, "year")
              .format("YYYY-MM-DD"),
            toDate: dayjs()
              .endOf("year")
              .subtract(-6, "year")
              .format("YYYY-MM-DD"),
          });
        }
        break;
    }
  };

  const LichHen_changeTypeTime = (newVal: number) => {
    switch (newVal) {
      case TypeTime.WEEK:
        {
          setLichHen_ParamFilter({
            ...lichHen_ParamFilter,
            timeType: newVal,
            fromDate: dayjs().startOf("week").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("week").format("YYYY-MM-DD"),
          });
        }
        break;
      case TypeTime.MONTH:
        {
          setLichHen_ParamFilter({
            ...lichHen_ParamFilter,
            timeType: newVal,
            fromDate: dayjs().startOf("year").format("YYYY-MM-DD"),
            toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
          });
        }
        break;
      case TypeTime.YEAR:
        {
          setLichHen_ParamFilter({
            ...lichHen_ParamFilter,
            timeType: newVal,
            fromDate: dayjs()
              .startOf("year")
              .subtract(-6, "year")
              .format("YYYY-MM-DD"),
            toDate: dayjs()
              .endOf("year")
              .subtract(-6, "year")

              .format("YYYY-MM-DD"),
          });
        }
        break;
    }
  };

  const initialSpacing = 20;
  const barWidth = 12;
  const charWidth = screenWidth - 80;
  const numberOfBars = dataDoanhThu.length;
  const spacing =
    numberOfBars < 3 ? 50 : (charWidth - initialSpacing) / numberOfBars;

  const showDropdownDate = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        setPosition({ x, y, width, height });
        setIsShowDropdownDate(true);
      });
    }
  };
  const measurePosition = () => {
    const handle = findNodeHandle(dropdownRef.current);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setPosition({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const onApplyDateRange = (from: string, to: string) => {
    setParamSearch({ ...paramSearch, fromDate: from, toDate: to });
    setIsShowDateRange(false);

    setLabelFilterDate(
      dayjs(from).format("DD/MM/YYYY") + " - " + dayjs(to).format("DD/MM/YYYY")
    );
  };

  return (
    <ScrollView style={[styles.container]}>
      <View style={{ gap: 24 }}>
        <View style={{ gap: 16 }}>
          <View ref={dropdownRef} onLayout={measurePosition}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 4,
                backgroundColor: "#66646626",
                width: 175,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={showDropdownDate}
            >
              <Text style={{ fontSize: 12 }}>{labelFilterDate}</Text>
              <Icon name="chevron-down" type={IconType.IONICON} size={12} />
            </TouchableOpacity>
            <Popover
              visible={isShowDropdownDate}
              onClose={() => setIsShowDropdownDate(false)}
              position={position}
              POPUP_WIDTH={175}
            >
              <View>
                {arrDateFilter?.map((x) => (
                  <TouchableOpacity
                    style={{ padding: 8 }}
                    key={x.id}
                    onPress={() => SoLuong_changeTypeTime(x.id)}
                  >
                    <Text
                      style={{
                        color:
                          x.id === paramSearch?.dateType
                            ? theme.colors.primary
                            : theme.colors.black,
                      }}
                    >
                      {x.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Popover>
            <Popover
              visible={isShowDateRange}
              onClose={() => setIsShowDateRange(false)}
              position={position}
              POPUP_WIDTH={screenWidth - 20}
            >
              <DateRangePicker
                from={paramSearch?.fromDate ?? ""}
                to={paramSearch?.toDate ?? ""}
                onChangeDate={onApplyDateRange}
                onClose={() => setIsShowDateRange(false)}
              />
            </Popover>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={[styles.card]}>
              <Icon
                name="attach-money"
                type={IconType.MATERIAL}
                size={25}
                color={theme.colors.primary}
              />
              <View style={{ gap: 10 }}>
                <Text>Thực thu</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={styles.number}
                >
                  {CommonFunc.formatCurrency(thucThu)}
                </Text>
              </View>
            </View>
            <View style={[styles.card]}>
              <Icon
                name="bar-chart-outline"
                type={IconType.IONICON}
                size={25}
                color={theme.colors.primary}
              />
              <View style={{ gap: 10 }}>
                <Text>Doanh thu</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={styles.number}
                >
                  {CommonFunc.formatCurrency(doanhThu)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={[styles.card]}>
              <Icon
                name="calendar-outline"
                type={IconType.IONICON}
                size={25}
                color={theme.colors.primary}
              />
              <View style={{ gap: 10 }}>
                <Text>Lịch hẹn</Text>
                <Text style={styles.number}>
                  {CommonFunc.formatCurrency(soCuocHen)}
                </Text>
              </View>
            </View>
            <View style={[styles.card]}>
              <Icon
                name="cake-variant-outline"
                type={IconType.MATERIAL_COMMUNITY}
                size={25}
                color={theme.colors.primary}
              />
              <View style={{ gap: 10 }}>
                <Text>Sinh nhật</Text>
                <Text style={styles.number}>
                  {CommonFunc.formatCurrency(soKhachMoi)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <Text style={styles.title}>Doanh thu</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {tongDoanhThu > 0 ? (
              <Text style={{ fontSize: 12 }}>
                {CommonFunc.formatCurrency(tongDoanhThu)}
              </Text>
            ) : (
              <Text>{""}</Text>
            )}

            <View
              style={{
                flexDirection: "row",
              }}
            >
              {arrFilterButton?.map((x, index) => (
                <TouchableOpacity
                  key={x.id}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        doanhThu_ParamFilter?.timeType === x.id
                          ? theme.colors.primary
                          : theme.colors.disabled,
                    },
                    {
                      borderTopLeftRadius: index === 0 ? 4 : 0,
                      borderBottomLeftRadius: index === 0 ? 4 : 0,
                    },
                    {
                      borderTopRightRadius: index === 2 ? 4 : 0,
                      borderBottomRightRadius: index === 2 ? 4 : 0,
                    },
                  ]}
                  onPress={() => DoanhThu_changeTypeTime(x.id)}
                >
                  <Text
                    style={{
                      color:
                        doanhThu_ParamFilter?.timeType === x.id
                          ? theme.colors.white
                          : theme.colors.black,
                      textAlign: "center",
                      fontSize: 11,
                    }}
                  >
                    {x.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {(dataDoanhThu?.length ?? 0) === 0 ? (
            <PageEmpty
              txt=" Không có dữ liệu để hiển thị"
              style={{ height: 80 }}
            />
          ) : (
            <>
              <View style={{ width: charWidth }}>
                <BarChart
                  data={dataDoanhThu}
                  width={charWidth}
                  frontColor={theme.colors.primary}
                  maxValue={barChartAxistConfig?.maxValue}
                  noOfSections={barChartAxistConfig?.noOfSections}
                  stepValue={barChartAxistConfig?.stepValue}
                  formatYLabel={(val: string) =>
                    ChartsFunc.formatYLabel(parseFloat(val), true)
                  }
                  barWidth={barWidth}
                  spacing={spacing}
                  initialSpacing={initialSpacing}
                  yAxisTextStyle={{ fontSize: 11 }}
                  xAxisLabelTextStyle={{
                    color: "black",
                    fontSize: 10,
                    marginRight: 10, // đẩy chữ vào trong một chút
                    transform: [{ translateX: 10 }],
                  }}
                />
              </View>
            </>
          )}
        </View>
        <View style={{ gap: 16, flex: 1 }}>
          <Text style={styles.title}>Lịch hẹn</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {(dataLichHen?.length ?? 0) > 0 ? (
              <Text>Số lượng</Text>
            ) : (
              <Text>{""}</Text>
            )}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {arrFilterButton?.map((x, index) => (
                <TouchableOpacity
                  key={x.id}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        lichHen_ParamFilter?.timeType === x.id
                          ? theme.colors.primary
                          : theme.colors.disabled,
                    },
                    {
                      borderTopLeftRadius: index === 0 ? 4 : 0,
                      borderBottomLeftRadius: index === 0 ? 4 : 0,
                    },
                    {
                      borderTopRightRadius: index === 2 ? 4 : 0,
                      borderBottomRightRadius: index === 2 ? 4 : 0,
                    },
                  ]}
                  onPress={() => LichHen_changeTypeTime(x.id)}
                >
                  <Text
                    style={{
                      color:
                        lichHen_ParamFilter?.timeType === x.id
                          ? theme.colors.white
                          : theme.colors.black,
                      textAlign: "center",
                      fontSize: 11,
                    }}
                  >
                    {x.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {(dataLichHen?.length ?? 0) === 0 ? (
            <PageEmpty
              txt="Không có dữ liệu để hiển thị"
              style={{ height: 80 }}
            />
          ) : (
            <LineChart
              data={dataLichHen}
              initialSpacing={20}
              width={charWidth}
              textFontSize={13}
              textColor1={theme.colors.primary}
              thickness={2}
              curved
              curveType={CurveType.CUBIC}
              color={theme.colors.primary}
              spacing={
                (dataLichHen?.length ?? 0) < 2
                  ? 30
                  : charWidth / (dataLichHen.length - 1)
              }
              textShiftY={-8}
              textShiftX={-10}
              yAxisTextStyle={{ fontSize: 11 }}
              xAxisLabelTextStyle={{ fontSize: 11 }}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    boxPadding: { paddingHorizontal: 16, paddingVertical: 8 },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    barCharTtopLabel: {
      color: theme.colors.primary,
      fontSize: 12,
      marginBottom: 6,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      padding: 14,
      height: 85,
      width: (screenWidth - 48) / 2,
      backgroundColor: "#E5F3FF",
      // shadowColor: "#000",
      // shadowOffset: { width: 0, height: 0.5 },
      // shadowOpacity: 0.25,
      // shadowRadius: 3, // tương đương với Blur
    },
    title: { fontSize: 16, fontWeight: 700 },
    button: {
      width: 54,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    number: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
