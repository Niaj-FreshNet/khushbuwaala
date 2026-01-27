// Material-related types
export interface Material {
  id: string;
  materialName: string;
}

export interface MaterialFormValues {
  materialName: string;
}

export interface MaterialApiResponse {
  data: {
    data: Material[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}