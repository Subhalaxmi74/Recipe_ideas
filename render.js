import { getRecipesByCategory, getRecipeByName } from "./api.js";

export function renderErrorMessage(message, resultsContainer) {
  resultsContainer.innerHTML = "";
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;
  resultsContainer.append(errorMessage);
}

export function renderCategoryList(
  categories,
  appState,
  categoryListContainer,
  showLoading,
  hideLoading,
  resultsContainer,
  contentContainer,
  sidebarButton,
  menuIcon
) {
  if (categories.length === 0)
    renderErrorMessage(
      "Recipe categories could not be found.",
      resultsContainer
    );

  categoryListContainer.innerHTML = "";

  const categoryList = document.createElement("ul");
  categoryList.classList.add("category-list-box");

  categories.forEach((category) => {
    const categoryItem = document.createElement("li");

    const categoryButton = document.createElement("button");
    categoryButton.classList.add("search-button", "category-button");

    categoryButton.textContent = category.strCategory;

    categoryButton.addEventListener("click", () => {
      getRecipesByCategory(
        category.strCategory,
        appState,
        showLoading,
        hideLoading,
        resultsContainer,
        contentContainer,
        sidebarButton,
        menuIcon
      );
    });

    categoryItem.appendChild(categoryButton);
    categoryList.appendChild(categoryItem);
  });
  categoryListContainer.appendChild(categoryList);
}

export function renderCategoryInfo(categories, resultsContainer) {
  const categoryInfoContainer = document.createElement("ul");
  categoryInfoContainer.classList.add("category-info-container");

  categories.forEach((category) => {
    const categoryInfoItem = document.createElement("li");
    categoryInfoItem.classList.add("info-item");

    const categoryImgWrapper = document.createElement("figure");
    categoryImgWrapper.classList.add("category-image-wrapper");
    const categoryImg = document.createElement("img");
    categoryImg.src = category.strCategoryThumb;
    categoryImg.alt = `Image representing recipes in the category of ${category.strCategory}`;
    categoryImgWrapper.appendChild(categoryImg);

    const categoryInfoText = document.createElement("div");
    categoryInfoText.classList.add("category-info-text");
    const categoryHeading = document.createElement("h3");
    categoryHeading.textContent = category.strCategory;
    const categoryDescription = document.createElement("p");
    categoryDescription.textContent = category.strCategoryDescription;
    categoryInfoText.append(categoryHeading, categoryDescription);
    categoryInfoItem.append(categoryImgWrapper, categoryInfoText);
    categoryInfoContainer.append(categoryInfoItem);
  });

  resultsContainer.appendChild(categoryInfoContainer);
}

export function renderRecipeList(
  meals,
  appState,
  showLoading,
  hideLoading,
  resultsContainer
) {
  resultsContainer.innerHTML = "";

  if (!meals || meals.length === 0) {
    renderErrorMessage(
      `Could not find ${appState.currentRecipeType} recipes.`,
      resultsContainer
    );
    return;
  }

  const recipeType = document.createElement("h2");
  recipeType.classList.add("recipe-type");
  recipeType.textContent = `${appState.currentRecipeType} Recipes`;
  resultsContainer.appendChild(recipeType);

  const mealsList = document.createElement("ul");
  mealsList.classList.add("preview-list-container");
  meals.forEach((meal) => {
    const mealItem = document.createElement("li");
    mealItem.classList.add("recipe-preview");

    const smImgWrapper = document.createElement("div");
    smImgWrapper.classList.add("sm-img-wrapper");

    const hasThumbImg = meal.strMealThumb && meal.strMealThumb !== "";

    const img = document.createElement("img");
    img.src = hasThumbImg
      ? `${meal.strMealThumb}`
      : "./assets/icons/restaurant.png";
    img.alt = hasThumbImg
      ? `Small image of ${meal.strMeal}`
      : "Generic food icon";
    smImgWrapper.appendChild(img);

    const previewText = document.createElement("div");
    previewText.classList.add("preview-text");

    const recipeName = document.createElement("button");
    recipeName.textContent = `${meal.strMeal}`;
    recipeName.classList.add("name-search-button");
    previewText.appendChild(recipeName);

    recipeName.addEventListener("click", () =>
      getRecipeByName(
        meal.strMeal,
        appState,
        showLoading,
        hideLoading,
        resultsContainer
      )
    );

    mealItem.appendChild(smImgWrapper);
    mealItem.appendChild(previewText);

    mealsList.appendChild(mealItem);
  });
  resultsContainer.appendChild(mealsList);
}

export function renderRecipe(
  recipe,
  appState,
  showLoading,
  hideLoading,
  resultsContainer
) {
  resultsContainer.innerHTML = "";

  if (!recipe) {
    renderErrorMessage("Recipe could not be loaded", resultsContainer);
    return;
  }

  const backToListBtn = document.createElement("button");
  backToListBtn.classList.add("back-button");
  const backImg = document.createElement("img");
  backImg.src = "./assets/icons/icons8-arrow-left-30.png";
  backImg.alt = "left arrow icon";
  const backText = document.createTextNode("Back to recipe list");
  backToListBtn.append(backImg, backText);
  resultsContainer.append(backToListBtn);

  backToListBtn.addEventListener("click", () => {
    renderRecipeList(
      appState.currentSearchResults,
      appState,
      showLoading,
      hideLoading,
      resultsContainer
    );
  });

  const recipeContainer = document.createElement("article");
  recipeContainer.classList.add("recipe-container");

  renderUpperTags(recipe, recipeContainer);

  const recipeTitle = document.createElement("h2");
  recipeTitle.classList.add("recipe-title");
  recipeTitle.textContent = recipe.strMeal;
  recipeContainer.append(recipeTitle);

  renderRecipeImage(recipe, recipeContainer);

  renderTags(recipe, recipeContainer);

  renderIngredients(recipe, recipeContainer);

  if (recipe.strInstructions && recipe.strInstructions !== "") {
    const instructions = document.createElement("section");
    instructions.classList.add("section-container");
    const instructionsHeading = document.createElement("h3");
    instructionsHeading.textContent = "Instructions";
    const instructionsText = document.createElement("p");
    instructionsText.textContent = recipe.strInstructions;
    instructions.append(instructionsHeading, instructionsText);
    recipeContainer.append(instructions);
  }

  renderLinkSection(recipe, recipeContainer);

  resultsContainer.append(recipeContainer);
}

export function renderUpperTags(recipe, parentContainer) {
  const upperTags = document.createElement("div");

  if (recipe.strCategory && recipe.strCategory !== "") {
    const categoryTag = document.createElement("span");
    categoryTag.classList.add("upper-tag", "category-tag");
    categoryTag.textContent = recipe.strCategory;
    upperTags.append(categoryTag);
  }

  if (recipe.strArea && recipe.strArea !== "") {
    const originTag = document.createElement("span");
    originTag.classList.add("upper-tag", "origin-tag");
    originTag.textContent = recipe.strArea;
    upperTags.append(originTag);
  }

  if (upperTags.firstChild) {
    parentContainer.insertAdjacentElement("afterbegin", upperTags);
  }
}

export function renderRecipeImage(recipe, parentContainer) {
  if (recipe.strMealThumb && recipe.strMealThumb !== "") {
    const recipeImageContainer = document.createElement("figure");
    recipeImageContainer.classList.add("main-img-wrapper");
    const recipeImg = document.createElement("img");
    recipeImg.src = recipe.strMealThumb;
    recipeImg.alt = `Image of ${recipe.strMeal}`;
    recipeImageContainer.append(recipeImg);
    if (recipeImageContainer.firstChild)
      parentContainer.append(recipeImageContainer);
  }
}

export function renderTags(recipe, parentContainer) {
  const tags =
    recipe.strTags && recipe.strTags !== "" ? recipe.strTags.split(",") : [];

  if (tags.length > 0) {
    const tagList = document.createElement("div");
    tagList.classList.add("tag-list");
    tags.forEach((tag) => {
      if (tag !== "") {
        const tagItem = document.createElement("div");
        tagItem.classList.add("tag");
        tagItem.textContent = tag;
        tagList.append(tagItem);
      }

      if (tagList.firstChild) parentContainer.append(tagList);
    });
  }
}

export function renderIngredients(recipe, parentContainer) {
  const recipeIngredients = getRecipeIngredients(recipe);
  const ingredientContainer = document.createElement("section");
  ingredientContainer.classList.add(
    "ingredient-container",
    "section-container"
  );

  const ingredientHeading = document.createElement("h3");
  ingredientHeading.textContent = "Ingredients";
  ingredientContainer.append(ingredientHeading);

  if (recipeIngredients.length > 0) {
    const ingredientList = document.createElement("ul");
    ingredientContainer.append(ingredientList);

    recipeIngredients.forEach((ingredient) => {
      const [key, value] = Object.entries(ingredient)[0];
      if (key && value && key !== "") {
        const ingredientItem = document.createElement("li");
        const ingrValue = document.createElement("span");
        ingrValue.classList.add("ingr-value");
        ingrValue.textContent = value;
        const ingrKey = document.createElement("span");
        ingrKey.textContent = key;
        ingredientItem.append(ingrValue, ingrKey);
        ingredientList.append(ingredientItem);
      }
    });
  }
  parentContainer.append(ingredientContainer);
}

function getRecipeIngredients(recipe) {
  const ingredients = [];
  const measures = [];
  const ingredientsWithMeasures = [];

  for (const [key, value] of Object.entries(recipe))
    if (key.startsWith("strIngredient")) {
      ingredients.push(value);
    }

  for (const [key, value] of Object.entries(recipe))
    if (key.startsWith("strMeasure")) {
      measures.push(value);
    }

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i]?.trim();
    const measure = measures[i]?.trim() || "";

    if (ingredient) {
      ingredientsWithMeasures.push({ [ingredient]: measure });
    }
  }

  return ingredientsWithMeasures;
}

export function renderLinkSection(recipe, parentContainer) {
  const linkContainer = document.createElement("section");
  linkContainer.classList.add("section-container");
  const linkHeading = document.createElement("h3");
  linkHeading.textContent = "Recipe Links";
  linkContainer.append(linkHeading);

  if (recipe.strSource && recipe.strSource.trim() !== "") {
    const originalSource = document.createElement("p");
    originalSource.classList.add("link");

    const label = document.createTextNode("Recipe source: ");

    const link = document.createElement("a");
    link.href = recipe.strSource;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = recipe.strSource;

    originalSource.appendChild(label);
    originalSource.appendChild(link);
    linkContainer.appendChild(originalSource);
  }

  if (linkContainer.querySelector(".link")) {
    parentContainer.append(linkContainer);
  }

  renderVideo(recipe, linkContainer);
}

export function renderVideo(recipe, parentContainer) {
  if (
    typeof recipe.strYoutube === "string" &&
    recipe.strYoutube.trim() !== ""
  ) {
    const videoId = recipe.strYoutube.split("v=")[1]?.split("&")[0];
    if (!videoId) return;

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const testImage = new Image();
    testImage.src = thumbnailUrl;

    testImage.onload = () => {
      if (testImage.width === 120 && testImage.height === 90) {
        console.warn(
          "Broken or private video thumbnail skipped:",
          recipe.strMeal
        );
        return;
      }
      const videoWrapper = document.createElement("div");
      videoWrapper.classList.add("video-thumbnail-wrapper");

      const thumbnail = document.createElement("img");
      thumbnail.classList.add("video-thumbnail");
      thumbnail.src = thumbnailUrl;
      thumbnail.alt = `Video preview for ${recipe.strMeal}`;
      thumbnail.style.cursor = "pointer";

      const playButton = document.createElement("div");
      const playImg = document.createElement("img");
      playImg.src = "./assets/icons/icons8-play-video-30.png";
      playImg.alt = "play video icon";
      playButton.append(playImg);
      playButton.classList.add("play-button");

      videoWrapper.appendChild(thumbnail);
      videoWrapper.appendChild(playButton);
      parentContainer.append(videoWrapper);

      videoWrapper.addEventListener(
        "click",
        () => {
          const iframe = document.createElement("iframe");
          iframe.classList.add("video-embed");
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;

          parentContainer.replaceChild(iframe, videoWrapper);
        },
        { passive: true }
      );
    };
  }
}
