export type CreateOrder = {
  email: string;
  name: string;
  address: string;
  message: string;
  currencyId: string;
  items: {
    productId: string;
    quantity: number;
    attributes: {
      attributeId: string;
      attributeValueId: string;
    }[];
  }[];
};
