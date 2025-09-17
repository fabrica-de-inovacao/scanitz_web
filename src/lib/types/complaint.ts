export interface ComplaintPosition {
  id: string | number;
  lat: number;
  lng: number;
  title?: string;
  district?: string;
  weight?: number;
  status?: number | string;
}
