export type CreateOrder = {
  email: string;
  name: string;
  message: string;
  items: {
    productId: string;
    quantity: number;
    attributes: {
      attributeId: string;
      attributeVaklueId: string;
    }[];
  }[];
};
