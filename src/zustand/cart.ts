import { create } from 'zustand';
import type { Price } from '../graphql/queryTypes';
import { persist } from 'zustand/middleware';

export type AttributeSelection = {
  attributeId: string;
  attributeValueId: string;
};

export type CartItem = {
  productId: string;
  productContent: string;
  name: string;
  price: Price;
  quantity: number;
  attributes: AttributeSelection[];
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  updateCartItem: (item: CartItem, newAttribute: AttributeSelection) => void;
};

const isSameAttributes = (a: AttributeSelection[], b: AttributeSelection[]) => {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
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
        const cart = get().cart;

        const newCart = cart
          .map((cartItem) => {
            if (
              cartItem.productId === item.productId &&
              isSameAttributes(cartItem.attributes, item.attributes)
            ) {
              if (cartItem.quantity > 1) {
                return {
                  ...cartItem,
                  quantity: cartItem.quantity - 1,
                };
              }
              return null;
            }
            return cartItem;
          })
          .filter((cartItem) => cartItem !== null);

        set({ cart: newCart });
      },

      updateCartItem: (item, newAttribute) => {
        const cart = get().cart;

        const newCart = cart.map((cartItem) => {
          if (
            cartItem.productId === item.productId &&
            isSameAttributes(cartItem.attributes, item.attributes)
          ) {
            const newAttributes = cartItem.attributes.map((attr) => {
              if (attr.attributeId === newAttribute.attributeId) {
                return newAttribute;
              } else {
                return attr;
              }
            });
            return {
              ...cartItem,
              attributes: newAttributes,
            };
          } else {
            return cartItem;
          }
        });

        set({ cart: newCart });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
