import request from 'graphql-request';
import { type CreateOrder } from '../graphql/mutationTypes';
import { useMutation } from '@tanstack/react-query';
import { CREATE_ORDER_MUTATION } from '../graphql/mutationGraph';

const endpoint = 'http://localhost:8080/api/graphql';

export async function createOrder(order: CreateOrder) {
  try {
    const response = await request(endpoint, CREATE_ORDER_MUTATION, { order });
    return response.createOrder;
  } catch (error) {
    throw error;
  }
}

export const useCreateOrder = () => {
  return useMutation({
    mutationKey: ['create-order'],
    mutationFn: async (order: CreateOrder) => {
      await createOrder(order);
    },
  });
};
