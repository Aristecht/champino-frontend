import type { CreateBranchInput } from "@/generated/output";

export type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours?: string | null;
  isActive: boolean;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
};

export type BranchFormState = CreateBranchInput & { isActive?: boolean };

export const EMPTY_BRANCH_FORM: BranchFormState = {
  name: "",
  city: "",
  address: "",
  phone: "",
  workingHours: "",
  latitude: undefined,
  longitude: undefined,
};

export const BRANCH_FORM_FIELDS: {
  key: keyof BranchFormState;
  label: string;
  required: boolean;
  placeholder?: string;
}[] = [
  { key: "name", label: "Название", required: true },
  { key: "city", label: "Город", required: true },
  { key: "address", label: "Адрес", required: true },
  { key: "phone", label: "Телефон", required: true },
  {
    key: "workingHours",
    label: "Часы работы",
    required: false,
    placeholder: "Пн–Вс 9:00–21:00",
  },
  {
    key: "latitude",
    label: "Широта (GPS)",
    required: false,
    placeholder: "55.7558",
  },
  {
    key: "longitude",
    label: "Долгота (GPS)",
    required: false,
    placeholder: "37.6176",
  },
];
