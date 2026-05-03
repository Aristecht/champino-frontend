export interface DeliveryBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
