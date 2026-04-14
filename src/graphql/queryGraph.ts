import { gql } from 'graphql-request';

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
      gallery
      attributes {
        id
        items {
          id
          value
          displayValue
          position
          __typename
        }
        __typename
      }
      prices {
        id
        amount
        __typename
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

export const GET_PRODUCT_DATA = gql`
  query GetStoreData($productId: String!) {
    product(productId: $productId) {
      id
      name
      category
      inStock
      description
      brand
      gallery
      attributes {
        id
        items {
          id
          value
          displayValue
          position
          __typename
        }
        __typename
      }
      prices {
        id
        amount
        __typename
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
