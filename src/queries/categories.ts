import { gql } from 'graphql-request';
import { request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { type Category, type ProductDataResponse } from '../graphql/types';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_STORE_DATA = gql`
  query GetStoreData($categoryName: String!) {
    categories {
      id
      name
    }
    products(category: $categoryName) {
      id
      name
      category
      inStock
      description
      brand
      attributes {
        id
        items {
          id
          value
          displayValue
          __typename
        }
        __typename
      }
      prices {
        id
        amount
        currency {
          symbol
          label
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

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
