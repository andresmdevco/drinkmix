# 🍸 DrinkMix

Aplicación web construida con **React**, **TypeScript** y **Tailwind CSS** para buscar bebidas y recetas de cócteles a partir de la API de **TheCocktailDB**. Además de la búsqueda tradicional, permite generar recetas personalizadas mediante **IA** a partir de los ingredientes que el usuario indique, con streaming de texto en tiempo real. El estado global se gestiona con **Zustand** organizado en slices, y las bebidas favoritas persisten entre sesiones.

## 🌐 Demo

🔗 [https://drinkmix-andresmdevco.vercel.app/](https://drinkmix-andresmdevco.vercel.app/)

## 🛠️ Tecnologías Utilizadas

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- React 19
- Tailwind CSS 4

Además:
- **React Router** — enrutamiento con `BrowserRouter` y carga diferida (`lazy` + `Suspense`) de vistas
- **Zustand** — manejo del estado global mediante slices, combinado con el middleware `devtools`
- **Zod** — validación en tiempo de ejecución de las respuestas de la API de recetas
- **Axios** — cliente HTTP para consumir la API de TheCocktailDB
- **Vercel AI SDK** (`ai` + `@openrouter/ai-sdk-provider`) — generación de recetas con IA vía OpenRouter, con streaming de texto
- **Headless UI** — componentes accesibles para el modal (`Dialog`) y las transiciones (`Transition`)
- **Heroicons** y **react-icons** — iconografía de la interfaz (notificaciones, spinner)

## ✨ Características

- 🔎 Búsqueda de bebidas por nombre o por categoría, de forma mutuamente excluyente en el formulario.
- 📋 Listado de categorías obtenido dinámicamente desde la API.
- 🧊 Vista de detalle de cada receta en un modal: imagen, ingredientes con sus medidas e instrucciones de preparación.
- ⭐ Agregar y eliminar bebidas de favoritos, con persistencia automática en `localStorage`.
- 📂 Página dedicada para consultar las bebidas favoritas guardadas.
- 🤖 Generación de recetas personalizadas con IA a partir de un prompt del usuario, mostrando el texto progresivamente mientras se genera.
- 🔔 Sistema de notificaciones para validaciones y confirmaciones (agregar/eliminar favoritos, errores de búsqueda).
- ⚡ Carga diferida (code splitting) de las vistas principales para optimizar el rendimiento.
- 📱 Diseño responsive con Tailwind CSS.

## 📂 Archivos principales

| Archivo | Descripción |
|---|---|
| `router.tsx` | Define las rutas de la app (`/`, `/favorites`, `/generate`) dentro de `Layout`, cargando `IndexPage` y `FavoritesPage` de forma diferida con `lazy` y `Suspense` |
| `layouts/Layout.tsx` | Layout raíz. Carga los favoritos guardados al montar (`loadFromStorage`) y renderiza `Header`, `Outlet`, `Modal` y `Notification` |
| `components/Header.tsx` | Cabecera con navegación y formulario de búsqueda (nombre o categoría, mutuamente excluyentes); obtiene las categorías al montar y dispara `searchRecipes` |
| `components/DrinkCard.tsx` | Tarjeta de una bebida en el listado; su botón dispara `selectRecipe` para abrir el modal con el detalle |
| `components/Modal.tsx` | Modal de detalle de receta construido con Headless UI; itera `strIngredient`/`strMeasure` del 1 al 15 y permite agregar/eliminar de favoritos |
| `components/Notification.tsx` | Componente de notificación tipo toast, animado con Headless UI, controlado desde el store |
| `views/IndexPage.tsx` | Vista principal; muestra el grid de resultados de búsqueda o un mensaje cuando no hay resultados aún |
| `views/FavoritesPage.tsx` | Vista de favoritos; muestra el grid de bebidas guardadas o un mensaje de estado vacío |
| `views/GenereateAI.tsx` | Vista de generación con IA; envía el prompt del usuario y muestra el texto de la receta a medida que se genera (streaming) |
| `services/RecipeService.ts` | Encapsula las llamadas a la API de TheCocktailDB (categorías, búsqueda, detalle por id) y valida cada respuesta con Zod |
| `services/AIService.ts` | Define el prompt de sistema del bartender virtual y expone el `textStream` generado por el modelo de IA vía `streamText` |
| `stores/useAppStore.ts` | Store raíz de Zustand; combina los slices de recetas, favoritos, notificaciones e IA envueltos en `devtools` |
| `stores/recipeSlice.ts` | Slice de recetas: categorías, resultados de búsqueda, receta seleccionada y estado del modal |
| `stores/favoritesSlice.ts` | Slice de favoritos: agregar/eliminar, verificar existencia y cargar/persistir en `localStorage` |
| `stores/notificationSlice.ts` | Slice de notificaciones: mostrar y ocultar mensajes con auto-cierre por `setTimeout` |
| `stores/aiSlice.ts` | Slice de IA: dispara `generateRecipe` y concatena el `textStream` recibido en el estado `recipe` |
| `lib/axios.ts` | Instancia de Axios configurada con la `baseURL` de TheCocktailDB |
| `lib/ai.ts` | Configuración del proveedor de IA (`createOpenRouter`) usando la API key de OpenRouter |
| `utils/recipes-schema.ts` | Esquemas de Zod (`CategoriesAPIResponseSchema`, `DrinksAPIResponse`, `RecipeAPIResponseSchema`, `SearchFilterSchema`) para validar las respuestas de la API |
| `types/index.ts` | Tipos inferidos desde los esquemas de Zod (`Categories`, `Drinks`, `Drink`, `Recipe`, `SearchFilter`) |

## 🧠 Cómo funciona

**Búsqueda de recetas**
1. Al cargarse la app, `Header` ejecuta `fetchCategories` mediante un `useEffect` para poblar el selector de categorías.
2. El formulario deshabilita el campo contrario según cuál se esté completando (nombre o categoría), forzando que la búsqueda sea por uno u otro.
3. Al enviarse, si ambos campos están vacíos se muestra una notificación de error; de lo contrario se dispara `searchRecipes`.
4. `RecipeService.getRecipes` construye la URL (`search.php` o `filter.php`) según el filtro, y valida la respuesta con `DrinksAPIResponse.safeParse`.
5. Si la validación falla o no hay resultados, se muestra una notificación de "Bebida no encontrada"; si tiene éxito, se actualiza `drinks` en el store y `IndexPage` renderiza el grid de `DrinkCard`.

**Detalle y favoritos**

6. Al presionar "Ver Receta" en una `DrinkCard`, se dispara `selectRecipe`, que consulta `getRecipeById`, valida la receta completa con Zod y abre el `Modal`.
7. `Modal` itera los 15 posibles pares ingrediente/medida y renderiza solo los que existen, junto con las instrucciones.
8. Al presionar "Agregar/Eliminar de Favoritos", `handleClickFavorite` actualiza el array `favorites`, dispara una notificación, cierra el modal y persiste el nuevo estado en `localStorage`.
9. Al cargar la app, `Layout` ejecuta `loadFromStorage` para recuperar los favoritos guardados previamente.
 
**Generación con IA**

10. El usuario escribe un prompt (ej. Dame una receta de vodka con maracuyá para un domingo en la tarde) y envía el formulario de `GenerateAI`.
11. Si el prompt está vacío, se muestra una notificación de error y no se continúa.
12. Si hay texto, se dispara `generateRecipe`, que limpia la receta anterior y activa el estado `isGenerating` (muestra el spinner).
13. `AIService.generateRecipe` envía el prompt a `streamText` junto con un prompt de sistema que define el rol de bartender y el formato de salida esperado.
14. La respuesta llega en partes (streaming). Cada parte que va llegando se agrega al estado `recipe`, por lo que la receta se va mostrando progresivamente en pantalla en lugar de aparecer completa de una sola vez.

## 📚 Conceptos aplicados

- Organización del estado global con **Zustand** mediante el patrón de **slices** (`recipeSlice`, `favoritesSlice`, `notificationSlice`, `aiSlice`) combinados en un único store con `devtools`.
- Comunicación entre slices, invocando acciones de un slice desde otro (ej. `favoritesSlice` disparando `showNotification` y `closeModal`).
- Validación de esquemas en tiempo de ejecución con **Zod** (`z.object`, `z.infer`, `safeParse`) para las distintas respuestas de la API externa.
- Consumo de **streaming de texto** de un modelo de IA con el **Vercel AI SDK** (`streamText`) e iteración asíncrona (`for await`) para actualizar el estado en tiempo real.
- Ingeniería de prompts: definición de un prompt de sistema estructurado para acotar el rol y el formato de salida del modelo.
- **Code splitting** con `React.lazy` y `Suspense` para cargar las vistas bajo demanda.
- Enrutamiento anidado con **React Router** (`Layout` con `Outlet`) y estilos condicionales según la ruta activa (`NavLink`, `useLocation`).
- Persistencia manual en `localStorage` (lectura al montar, escritura tras cada cambio) para los favoritos.
- Componentes accesibles y animados con **Headless UI** (`Dialog`, `Transition`) para el modal y las notificaciones.
- Capa de servicios (`services/`) separada de la capa de estado, encapsulando el acceso a las APIs externas.
- Tipado de props, store y esquemas con TypeScript, con tipos inferidos directamente desde Zod.
- Organización del proyecto por responsabilidades (`components`, `views`, `layouts`, `stores`, `services`, `lib`, `types`, `utils`).

## 🚀 Cómo ejecutar el proyecto

1. Clonar el repositorio:
```bash
   git clone https://github.com/andresmdevco/drinkmix.git
   cd drinkmix
```
2. Instalar las dependencias:
```bash
   npm install
```
3. Crear un archivo `.env` en la raíz del proyecto con tu API key de OpenRouter (necesaria para la generación de recetas con IA):
```bash
   VITE_OPENROUTER_KEY=tu_api_key_aqui
```
4. Ejecutar el proyecto en modo desarrollo:
```bash
   npm run dev
```
5. Abrir [http://localhost:5173](http://localhost:5173) en el navegador