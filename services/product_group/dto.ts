export interface IProductGroupDto {
  id: string;
  maNhomHang?: string;
  tenNhomHang: string;
  tenNhomHang_KhongDau?: string;
  idParent?: string | null;
  color?: string;
  thuTuHienThi?: number;
  laNhomHangHoa?: boolean;

  tenNhomCha?: string;
}
