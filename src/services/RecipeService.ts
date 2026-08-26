import api from '../lib/axios';
import { CategoriesAPIResponseSchema, DrinksAPIResponse, RecipeAPIResponseSchema } from '../utils/recipes-schema';
import type { Drink, SearchFilter } from '../types';


export default {
  async getCategories() {
    const url = '/list.php?c=list';
    const { data } = await api(url);
    // Validar con ZOD
    const result = CategoriesAPIResponseSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }
  },

  async getRecipes(filters: SearchFilter) {
    let url: string;

    if (filters.name.trim()) {
      url = `/search.php?s=${filters.name.trim()}`;
    } else {
      url = `/filter.php?c=${filters.category}`;
    }
    const { data } = await api(url);
    const result = DrinksAPIResponse.safeParse(data);

    if (result.success) {
      return result.data;
    }
  },

  async getRecipeById(id: Drink['idDrink']) {
    const url = `/lookup.php?i=${id}`;
    const { data } = await api(url);
    const result = RecipeAPIResponseSchema.safeParse(data.drinks[0]);
    if (result.success) {
      return result.data;
    }
  }
}

// export async function getRecipes(filters: SearchFilter) {
//   const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${filters.category}&i=${filters.name}`;
//   const { data } = await axios(url);
//   const result = DrinksAPIResponse.safeParse(data);

//   if (result.success) {
//     return result.data;
//   }
// }