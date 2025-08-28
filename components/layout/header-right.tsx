import { IconType } from "@/enum/IconType";
import { IChiNhanhBasicDto } from "@/services/chi_nhanh/ChiNhanhDto";
import ChiNhanhService from "@/services/chi_nhanh/ChiNhanhService";
import { ISelect } from "@/services/commonDto/ISelect";
import { useAppContext } from "@/store/react_context/AppProvider";
import { Theme } from "@rneui/base";
import { Icon, useTheme } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Dropdown from "../dropdown";

const HeaderRight = () => {
  const { theme } = useTheme();
  const styles = createStyle(theme);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const targetRef = useRef<View>(null);

  const { userLogin, chiNhanhCurrent, setChiNhanhCurrent } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [lstChiNhanhByUser, setListChiNhanhByUser] = useState<
    IChiNhanhBasicDto[]
  >([]);

  const GetListChiNhanhByUserLogin = async () => {
    const data = await ChiNhanhService.GetChiNhanhByUser();
    setListChiNhanhByUser([...data]);
  };

  useEffect(() => {
    GetListChiNhanhByUserLogin();
  }, []);

  const changeChiNhanh = (item: ISelect) => {
    setChiNhanhCurrent({ id: item.id, tenChiNhanh: item.text });
  };

  const showPopover = () => {
    if (targetRef.current) {
      targetRef.current.measureInWindow((x, y, width, height) => {
        setPosition({ x, y, width, height });
        setVisible(true);
      });
    }
  };
  const measurePosition = () => {
    targetRef?.current?.measure((x, y, width, height) => {
      setPosition({ x, y, width, height });
      setVisible(true);
    });
  };

  const hidePopover = () => setVisible(false);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 16,
        gap: 4,
      }}
    >
      <Icon name="location-outline" type={IconType.IONICON} size={20} />
      <Dropdown
        options={lstChiNhanhByUser?.map((x) => {
          return { id: x.id, text: x.tenChiNhanh } as ISelect;
        })}
        itemSelected={{
          id: chiNhanhCurrent?.id ?? "",
          text: chiNhanhCurrent?.tenChiNhanh ?? "",
        }}
        onSelect={changeChiNhanh}
      />
      <Icon name="bell-outline" type={IconType.MATERIAL_COMMUNITY} size={20} />
    </View>
  );
};

export default HeaderRight;
const createStyle = (theme: Theme) =>
  StyleSheet.create({
    boxPopover: {
      flex: 1,
      paddingTop: 100,
      alignItems: "center",
    },
  });
