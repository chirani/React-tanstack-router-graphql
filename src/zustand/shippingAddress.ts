import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ShippingData = {
  name: string;
  address: string;
  email: string;
};

type ShippingStore = {
  shipping: ShippingData;
  setShipping: (data: Partial<ShippingData>) => void;
  resetShipping: () => void;
};

const initialState: ShippingData = {
  name: '',
  address: '',
  email: '',
};

export const useShippingStore = create<ShippingStore>()(
  persist(
    (set) => ({
      shipping: initialState,

      setShipping: (data) =>
        set((state) => ({
          shipping: {
            ...state.shipping,
            ...data,
          },
        })),

      resetShipping: () =>
        set({
          shipping: initialState,
        }),
    }),
    {
      name: 'shipping-storage',
    }
  )
);
