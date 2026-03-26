import { request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { type Category, type ProductDataResponse } from '../graphql/types';
import { GET_CATEGORIES, GET_STORE_DATA } from '../graphql/graph';

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
