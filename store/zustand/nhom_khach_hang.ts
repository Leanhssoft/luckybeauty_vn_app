import { ICustomerGroupDto } from "@/services/customer_group/ICustomerGroupDto";
import { create } from "zustand";
type NhomKhachHangStore = {
  nhomKhach: ICustomerGroupDto | null;
  setNhomKhach: (customer: ICustomerGroupDto) => void;
};
export const useNhomKhachHangStore = create<NhomKhachHangStore>((set) => ({
  nhomKhach: null,
  setNhomKhach: (item: ICustomerGroupDto) => set({ nhomKhach: item }),
}));
