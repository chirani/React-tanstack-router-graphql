import { request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import {
  type Category,
  type Product,
  type ProductDataResponse,
} from '../graphql/queryTypes';
import {
  GET_CATEGORIES,
  GET_PRODUCT_DATA,
  GET_STORE_DATA,
} from '../graphql/queryGraph';

const endpoint = 'http://localhost:8080/api/graphql';

export function useStoreData(categoryName: string) {
  return useQuery<ProductDataResponse>({
    queryKey: ['storeData', categoryName],
    queryFn: async () =>
      request<ProductDataResponse>(endpoint, GET_STORE_DATA, {
        categoryName,
      }),
  });
}

interface ProductsData {
  product: Product[];
}

export function useProductData(productId: string) {
  return useQuery<ProductsData>({
    queryKey: ['product', productId],
    queryFn: async () => {
      return request<ProductsData>(endpoint, GET_PRODUCT_DATA, {
        productId,
      });
    },
  });
}

interface CategoriesResponse {
  categories: Category[];
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // 2. Request the full object, not the array
      const data = await request<CategoriesResponse>(endpoint, GET_CATEGORIES);

      return data;
    },
  });
}
