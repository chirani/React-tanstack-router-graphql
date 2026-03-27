export interface AttributeItem {
  id: string;
  value: string;
  displayValue: string;
  __typename: string;
}

export interface Attribute {
  id: string;
  items: AttributeItem[];
  __typename: string;
}

interface Currency {
  symbol: string;
  label: string;
  __typename: string;
}

interface Price {
  id: string;
  amount: number;
  currency: Currency;
  __typename: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  description: string;
  brand: string;
  gallery: string[];
  attributes: Attribute[];
  prices: Price[];
  __typename: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductDataResponse {
  categories: Category[];
  products: Product[];
}
