import { create } from "zustand";
type BottomTabStore = {
  isHideTab: boolean;
  setIsHideTab: (val: boolean) => void;
};

export const useBottomTabSaleStore = create<BottomTabStore>((set) => ({
  isHideTab: false,
  setIsHideTab: (val) => set({ isHideTab: val }),
}));
