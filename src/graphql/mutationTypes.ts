export type CreateOrder = {
  currencyId: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
    price_amount: number;
    attributes: {
      attributeId: string;
      attributeValueId: string;
    }[];
  }[];
};
