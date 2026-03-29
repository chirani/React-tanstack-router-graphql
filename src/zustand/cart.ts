import { create } from 'zustand';
import type { Price } from '../graphql/types';

export type AttributeSelection = {
  attributeId: string;
  attributeValueId: string;
};

type CartItem = {
  productId: string;
  name: string;
  price: Price;
  quantity: number;
  attributes: AttributeSelection[];
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
};

const isSameAttributes = (a: AttributeSelection[], b: AttributeSelection[]) => {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (item) => {
    const cart = get().cart;

    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        isSameAttributes(cartItem.attributes, item.attributes)
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
      set({ cart: [...cart] });
      return;
    }

    set({ cart: [...cart, { ...item, quantity: 1 }] });
  },

  removeFromCart: (item) => {
    set({
      cart: get().cart.filter(
        (cartItem) =>
          !(
            cartItem.productId === item.productId &&
            isSameAttributes(cartItem.attributes, item.attributes)
          )
      ),
    });
  },
}));
