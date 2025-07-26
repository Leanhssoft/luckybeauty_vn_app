export interface IProductGroupDto {
  id: string;
  maNhomHang?: string;
  tenNhomHang: string;
  idParent?: string | null;
  color?: string;
  thuTuHienThi?: number;
  laNhomHangHoa?: boolean;
}
