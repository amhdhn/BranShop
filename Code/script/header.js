"use strict";
import { removeAllChild, preventClick, showModal, cutLargeString, createAnchor, createDiv, createSpan, createP } from "./func.js";

////////////////////////////////////////////// mobile search section
const searchBtn = document.querySelector(".searchBtn");
const minSearchContainer = document.querySelector(".minSearchContainer");
const closeSearchDivBtn = document.querySelector(".closeSearchDivBtn");
const minSearchInput = document.querySelector(".minSearchInput");
const minSearchResultListElem = document.querySelector(".minSearchResultList");
const minLoadingSpinElem = document.querySelector(".minLoadingSpin");
let waitForUserInput = null;

searchBtn.addEventListener("click", showMinSearchContainer);
closeSearchDivBtn.addEventListener("click", closeMinSearchContainer);
minSearchInput.addEventListener("keyup", minSearchInputHandler);
minSearchContainer.addEventListener("click", preventClick)

function showMinSearchContainer() {
    minSearchContainer.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeMinSearchContainer() {
    minSearchContainer.classList.remove("active");
    document.body.style.overflow = "";
    removeAllChild(minSearchResultListElem);
    minSearchInput.value = "";
}

function minSearchInputHandler(event) {
    clearTimeout(waitForUserInput);
    waitForUserInput = setTimeout(() => {
        fetchMinSearchInfo(event);
    }, 600);
}

function fetchMinSearchInfo(event) {
    let { value: userSearch } = event.target;
    let { key: userKey } = event;
    if (userKey === "Enter" && userSearch !== "") {
        window.location = `./search?searchName:${userSearch}`;
    } else if (userSearch !== "") {
        minLoadingSpinElem.classList.add("active");
        fetch(`http://localhost:3000/products?name_like=${userSearch}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error("خطا در برقراری ارتباط با سرور.");
                }
            })
            .then(data => {
                removeAllChild(minSearchResultListElem);
                generateSearchResultList(minSearchResultListElem, data, userSearch, "minSearchResultItem");
            })
            .catch(err => {
                showModal(err.message);
            })
            .finally(() => {
                minLoadingSpinElem.classList.remove("active");
            });
    } else if (userSearch === "") {
        removeAllChild(minSearchResultListElem);

    }
}

/////////////////////////////////////////////////// search section

const searchInput = document.querySelector(".searchInput");
const searchResultListElem = document.querySelector(".searchResultList");
const searchDivElem = document.querySelector(".searchDiv");
const searchResultHintElem = document.querySelector(".searchResultHint");
const loadingSpinElem = document.querySelector(".loadingSpin");

searchInput.addEventListener('focus', showSearchBox);
searchInput.addEventListener("keyup", searchInputHandler);
searchDivElem.addEventListener("click", preventClick);

window.addEventListener("click", Event => {
    if (searchDivElem.classList.contains("active")) {
        hideSearchBox();
    }
})

function showSearchBox() {
    searchResultListElem.classList.add("active");
    searchDivElem.classList.add("active");
    searchResultHintElem.classList.add("active");
}

function hideSearchBox() {
    searchResultListElem.classList.remove("active");
    searchDivElem.classList.remove("active");
    searchResultHintElem.classList.remove("active");
}


function searchInputHandler(Event) {
    clearTimeout(waitForUserInput);
    waitForUserInput = setTimeout(() => {
        fetchSearchInfo(Event);
    }, 600);

}

function fetchSearchInfo(Event) {
    let keyPressed = Event.key;
    if (keyPressed === "Escape" && searchResultListElem.classList.contains("active")) {
        Event.target.blur();
        return;
    }
    let { value: userSearch } = Event.target;
    let { key: userKey } = Event;
    if (userKey === "Enter" && userSearch !== "") {
        window.location = `./search?searchName:${userSearch}`;
    } else if (userSearch !== "") {
        loadingSpinElem.classList.add("active");
        fetch(`http://localhost:3000/products?name_like=${userSearch}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return new Error("خطا در برقراری ارتباط با سرور.");
                }
            })
            .then(data => {
                removeAllChild(searchResultListElem);
                generateSearchResultList(searchResultListElem, data, userSearch, "searchResultItem");
            })
            .catch(err => {
                showModal(err.message);
            })
            .finally(() => {
                loadingSpinElem.classList.remove("active");
            });
    }
    if (userSearch === "") {
        removeAllChild(searchResultListElem);
    }
}

function generateSearchResultList(parent, resultData, userSearch, itemClassName) {
    if (resultData === null) {
        return;
    } else if (resultData.length) {
        let newListFragment = document.createDocumentFragment();
        resultData.forEach(product => {
            let newSearchItemList = createAnchor(itemClassName, product.name, `./product.html?product=${product.id}`);
            newListFragment.appendChild(newSearchItemList);
        });
        parent.appendChild(newListFragment);
    } else {
        let newSearchItemList = createP(itemClassName, userSearch);
        parent.appendChild(newSearchItemList);
    }
}

///////////////////////////////////////////////// navigation section
const navigationBtn = document.querySelector(".navigationBtn");
const navigationCloserElem = document.querySelector(".navigationCloser");
const navigationContainerElem = document.querySelector(".navigationContainer");
const navigationListElem = document.querySelector(".navigationList");
const navigationCloseBtn = document.querySelector(".navigationCloseBtn");


navigationBtn.addEventListener("click", showNavigation);
navigationCloserElem.addEventListener("click", closeNavigation);
navigationCloseBtn.addEventListener("click", closeNavigation);
window.addEventListener("load", () => {
    fetch("http://localhost:3000/categories")
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                return new Error("خطا در برقراری ارتباط با سرور.");
            }
        })
        .then(data => {
            generateNavigation(data);
            generateCategories(data);
        })
        .catch(err => {
            showModal("خطا در برقراری ارتباط با سرور");
        });
});

function showNavigation() {
    navigationCloserElem.classList.add("active");
    navigationContainerElem.style.width = "260px";
    document.body.style.overflow = "hidden";

}

function closeNavigation(event) {
    preventClick(event);
    navigationCloserElem.classList.remove("active");
    navigationContainerElem.style.width = "";
    document.body.style.overflow = "";

}

function generateNavigation(data) {
    navigationListElem.classList.remove("center");
    removeAllChild(navigationListElem);
    let newListFragment = document.createDocumentFragment();
    data.forEach(item => {
        let navigationCatName = createDiv("navigationCatName");

        navigationCatName.addEventListener("click", (event) => {
            let nextElement = navigationCatName.nextElementSibling;
            if (nextElement.classList.contains("active")) {
                nextElement.classList.remove("active");
            } else {
                nextElement.classList.add("active");
            }
        });
        let newCatName = createSpan("navigationCatNameSpan", item.name);

        let newCatLogo = createSpan("logo", item.logo);

        navigationCatName.append(newCatName, newCatLogo);

        let newSubCatList = createDiv("navigationCatList");

        let subCatList = item.subCat;
        subCatList.forEach(subCat => {
            let newSubCatItem = createAnchor("navigationCatItem", subCat, `./category.html?catName=${item.name}&subCatName=${subCat}`);
            newSubCatList.appendChild(newSubCatItem);
        });
        let newSubCatItem = createAnchor("navigationCatItem", "مشاهده همه", `./category.html?catName=${item.name}`);
        newSubCatList.appendChild(newSubCatItem);
        newListFragment.append(navigationCatName, newSubCatList);

    });
    navigationListElem.appendChild(newListFragment);
}

/////////////////////////////////////////////////////////// user cart
const categoryListElem = document.querySelector(".categoryList");

function generateCategories(data) {
    removeAllChild(categoryListElem);
    let newListFragment = document.createDocumentFragment();
    data.forEach(item => {
        let newCatTitle = createDiv("catTitle");

        let newCatName = createSpan("catTitleSpan", item.name);

        let newCatLogo = createSpan("catTitleLogo", item.logo);

        newCatTitle.append(newCatName, newCatLogo);

        let newSubCatList = createDiv("subCatList");

        let subCatList = item.subCat;
        subCatList.forEach(subCat => {
            let linkText = cutLargeString(subCat, 20);
            let newSubCatItem = createAnchor("subCatItem", linkText, `./category.html?catName=${item.name}&subCatName=${subCat}`);
            newSubCatList.appendChild(newSubCatItem);
        });

        let newSubCatItem = createAnchor("subCatItem", "مشاهده ی همه", `./category.html?catName=${item.name}`);
        newSubCatList.appendChild(newSubCatItem);
        newListFragment.append(newCatTitle, newSubCatList);

    });
    categoryListElem.appendChild(newListFragment);
}