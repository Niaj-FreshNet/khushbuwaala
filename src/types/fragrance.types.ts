// Fragrance-related types
export interface Fragrance {
  id: string;
  fragranceName: string;
}

export interface FragranceFormValues {
  fragranceName: string;
}

export interface FragranceApiResponse {
  data: {
    data: Fragrance[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}