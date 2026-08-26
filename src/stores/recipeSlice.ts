import type { StateCreator } from 'zustand';
import RecipeService from '../services/RecipeService';
import type { Categories, Drink, Drinks, Recipe, SearchFilter } from '../types';
import type { FavoritesSliceType } from './favoritesSlice';
import type { NotificationSliceType } from './notificationSlice';

export type RecipesSliceType = {
  categories: Categories;
  drinks: Drinks;
  selectedRecipe: Recipe;
  modal: boolean;
  fetchCategories: () => Promise<void>;
  searchRecipes: (searchFilters: SearchFilter) => Promise<void>;
  selectRecipe: (id: Drink['idDrink']) => Promise<void>;
  closeModal: () => void;
};

export const createRecipesSlice: StateCreator<RecipesSliceType & FavoritesSliceType & NotificationSliceType, [], [], RecipesSliceType> = (set, get) => ({
  categories: { drinks: [] },
  drinks: { drinks: [] },
  selectedRecipe: {} as Recipe,
  modal: false,
  fetchCategories: async () => {
    const categories = await RecipeService.getCategories();
    set({
      categories,
    });
  },
  searchRecipes: async (filters) => {
    const drinks = await RecipeService.getRecipes(filters);
    if (!drinks) {
      get().showNotification({
        text: 'Bebida no encontrada. Intenta con otro nombre.',
        error: true,
      });
      return;
    }
    set({
      drinks,
    });
  },
  selectRecipe: async (id) => {
    const selectedRecipe = await RecipeService.getRecipeById(id);
    set({
      selectedRecipe,
      modal: true,
    });
  },
  closeModal: () => {
    set({
      modal: false,
      selectedRecipe: {} as Recipe,
    });
  },
});
