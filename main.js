import { listCategories, getRecipesByIngredient } from "./api.js";

const queryInput = document.querySelector(".search-input");
const inputButton = document.querySelector(".search-button-input");
const contentContainer = document.querySelector(".content-container");
const categoryListContainer = document.querySelector(".category-container");
const resultsContainer = document.querySelector(".results-container");
const sidebarButton = document.querySelector(".sidebar-btn");
const menuIcon = `<img src="./assets/icons/icons8-menu-50.png" alt="menu icon" class="sidebar-icon"/> `;
const closeIcon = `<img src="./assets/icons/icons8-close-50.png" alt="close icon" class="sidebar-icon"/>`;

const appState = {
  query: "",
  currentRecipeType: "",
  currentSearchResults: [],
  isLoading: false,
  isSidebarOpen: false,
};

sidebarButton.innerHTML = contentContainer.classList.contains("sidebar-open")
  ? closeIcon
  : menuIcon;

const loadingIndicator = document.createElement("p");
loadingIndicator.classList.add("loading-indicator");
loadingIndicator.textContent = "Loading...";

function showLoading() {
  if (!resultsContainer.contains(loadingIndicator)) {
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(loadingIndicator);
  }
}

function hideLoading() {
  if (resultsContainer.contains(loadingIndicator)) {
    resultsContainer.removeChild(loadingIndicator);
  }
}

sidebarButton.addEventListener("click", () => {
  appState.isSidebarOpen = !appState.isSidebarOpen;
  contentContainer.classList.toggle("sidebar-open", appState.isSidebarOpen);
  sidebarButton.innerHTML = appState.isSidebarOpen ? closeIcon : menuIcon;
});

listCategories(
  appState,
  showLoading,
  hideLoading,
  resultsContainer,
  categoryListContainer,
  contentContainer,
  sidebarButton,
  menuIcon
);

queryInput.addEventListener("input", (e) => {
  appState.query = e.target.value;
});

queryInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    const value = queryInput.value.trim();
    if (!value) {
      return;
    }
    getRecipesByIngredient(
      value,
      queryInput,
      appState,
      showLoading,
      hideLoading,
      contentContainer,
      resultsContainer,
      sidebarButton,
      menuIcon
    );
  }
});

inputButton.addEventListener("click", () => {
  const value = queryInput.value.trim();
  if (!value) {
    return;
  }
  getRecipesByIngredient(
    value,
    queryInput,
    appState,
    showLoading,
    hideLoading,
    contentContainer,
    resultsContainer,
    sidebarButton,
    menuIcon
  );
});
