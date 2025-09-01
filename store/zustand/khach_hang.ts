import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import { create } from "zustand";

type KhachHangStore = {
  customer: IKhachHangItemDto | null;
  setCustomer: (customer: IKhachHangItemDto) => void;
};

export const useKhachHangStore = create<KhachHangStore>((set) => ({
  customer: null,
  setCustomer: (item: IKhachHangItemDto) => set({ customer: item }),
}));
