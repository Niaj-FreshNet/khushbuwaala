// Category-related types
export interface Category {
  id: string;
  categoryName: string;
  imageUrl?: string;
  sizes: string[];
  specification: 'male' | 'female' | 'unisex';
  published: boolean;
}

export interface CategoryFormValues {
  categoryName: string;
  sizes: string[];
  specification: 'male' | 'female' | 'unisex';
  published: boolean;
  imageUrl?: string;
}

export interface CategoryApiResponse {
  data: {
    data: Category[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

