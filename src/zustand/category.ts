import { create } from 'zustand';

interface CategoryState {
  id: string;
  updateCateogryId: (id: string) => void;
}

export const useStoreCategory = create<CategoryState>()((set) => ({
  id: '',
  updateCateogryId: (id: string) => set(() => ({ id: id })),
}));
