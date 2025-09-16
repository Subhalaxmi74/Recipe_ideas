import {
  renderErrorMessage,
  renderCategoryList,
  renderCategoryInfo,
  renderRecipeList,
  renderRecipe,
} from "./render.js";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

function fetchData(url, errMsg) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`${errMsg}, ${res.status}`);
    return res.json();
  });
}

export function listCategories(
  appState,
  showLoading,
  hideLoading,
  resultsContainer,
  categoryListContainer,
  sidebarButton,
  menuIcon
) {
  appState.isLoading = true;
  showLoading();
  fetchData(
    `${API_BASE}/categories.php`,
    "Recipe categories could not be loaded. Please try refreshing the page"
  )
    .then((data) => {
      const { categories } = data;
      renderCategoryList(
        categories,
        appState,
        categoryListContainer,
        showLoading,
        hideLoading,
        resultsContainer,
        sidebarButton,
        menuIcon
      );
      renderCategoryInfo(categories, resultsContainer);
    })
    .catch((err) => {
      renderErrorMessage(err.message, resultsContainer);
    })
    .finally(() => {
      appState.isLoading = false;
      hideLoading();
    });
}

export function getRecipesByIngredient(
  food,
  queryInput,
  appState,
  showLoading,
  hideLoading,
  contentContainer,
  resultsContainer,
  sidebarButton,
  menuIcon
) {
  appState.isLoading = true;
  showLoading();
  fetchData(
    `${API_BASE}/search.php?s=${food}`,
    `Recipes with ${food} could not be found`
  )
    .then((data) => {
      const { meals } = data;
      appState.currentRecipeType = food;
      renderRecipeList(
        meals,
        appState,
        showLoading,
        hideLoading,
        resultsContainer
      );
      appState.query = "";
      queryInput.value = "";
      appState.currentSearchResults = meals;
    })
    .catch((err) => renderErrorMessage(err.message, resultsContainer))
    .finally(() => {
      appState.isLoading = false;
      hideLoading();
      appState.isSidebarOpen = false;
      contentContainer.classList.remove("sidebar-open");
      sidebarButton.innerHTML = menuIcon;
    });
}

export function getRecipesByCategory(
  category,
  appState,
  showLoading,
  hideLoading,
  resultsContainer,
  contentContainer,
  sidebarButton,
  menuIcon
) {
  appState.isLoading = true;
  showLoading();
  fetchData(
    `${API_BASE}/filter.php?c=${category}`,
    `Could not load ${category} recipes`
  )
    .then((data) => {
      const { meals } = data;
      appState.currentRecipeType = category;
      renderRecipeList(
        meals,
        appState,
        showLoading,
        hideLoading,
        resultsContainer
      );
      appState.currentSearchResults = meals;
    })
    .catch((err) => renderErrorMessage(err.message, resultsContainer))
    .finally(() => {
      appState.isLoading = false;
      hideLoading();
      appState.isSidebarOpen = false;
      contentContainer.classList.remove("sidebar-open");
      sidebarButton.innerHTML =
        menuIcon ||
        `<img src="./assets/icons/icons8-menu-50.png" alt="menu icon" class="sidebar-icon"/> `;
    });
}

export function getRecipeByName(
  dishName,
  appState,
  showLoading,
  hideLoading,
  resultsContainer
) {
  appState.isLoading = true;
  showLoading();
  fetch(`${API_BASE}/search.php?s=${dishName}`)
    .then((res) => {
      if (!res.ok)
        throw new Error(
          `Could not load "${dishName} recipe", ${res.status}`,
          resultsContainer
        );
      return res.json();
    })
    .then((data) => {
      const meal = data.meals?.[0];
      if (!meal) {
        renderErrorMessage(
          `No recipe found with name "${dishName}"`,
          resultsContainer
        );
        return;
      }
      renderRecipe(meal, appState, showLoading, hideLoading, resultsContainer);
    })
    .catch((err) => renderErrorMessage(err.message, resultsContainer))
    .finally(() => {
      appState.isLoading = false;
      hideLoading();
    });
}
