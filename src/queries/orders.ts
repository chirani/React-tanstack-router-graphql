import request from 'graphql-request';
import { type CreateOrder } from '../graphql/mutationTypes';
import { useMutation } from '@tanstack/react-query';
import { CREATE_ORDER_MUTATION } from '../graphql/mutationGraph';
import { useCartStore } from '../zustand/cart';
import { useShippingStore } from '../zustand/shippingAddress';

const endpoint = 'http://localhost:8080/api/graphql';

export async function createOrder(order: CreateOrder) {
  try {
    const response = await request(endpoint, CREATE_ORDER_MUTATION, {
      input: order,
    });
    return response.createOrder;
  } catch (error) {
    throw error;
  }
}

export const useCreateOrder = () => {
  const { cart } = useCartStore();
  const { shipping } = useShippingStore();

  return useMutation({
    mutationKey: ['create-order'],
    mutationFn: async () => {
      const items: CreateOrder['items'] = cart.map((item) => ({
        attributes: item.attributes,
        price_amount: item.price.amount,
        productId: item.productId,
        quantity: item.quantity,
      }));

      const order: CreateOrder = {
        name: shipping.name,
        email: shipping.email,
        address: shipping.address,
        currencyId: cart[0].price.currency.label,
        message: '',
        items,
      };

      return await createOrder(order);
    },
  });
};
