import { create } from 'zustand';
import { createRecipesSlice, type RecipesSliceType } from './recipeSlice';

export const useAppStore = create<RecipesSliceType>((...a) => ({
  ...createRecipesSlice(...a),
}));
