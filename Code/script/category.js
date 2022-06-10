"use strict";
import { createAnchor, createDiv, createImg, createP, preventClick, removeAllChild, showModal } from "./func.js";
const mainContentContainer = document.querySelector(".mainContent");
const emtpyResultContainer = document.querySelector(".emtpyResultContainer");
const sortBtnContainer = document.querySelector(".sortBtnContainer");

const sortBtn = document.querySelector(".sortBtn");
const sortSectionElem = document.querySelector(".sortSection");
const closeSortSectionBtn = document.querySelector(".closeSortSectionBtn");
const productListElem = document.querySelector(".productList");

const defaultBtn = document.querySelector(".default");
const cheapBtn = document.querySelector(".cheap");
const expensiveBtn = document.querySelector(".expensive");



let urlSearch = new URLSearchParams(window.location.search);
let catName = urlSearch.get("catName");
let subCatName = urlSearch.get("subCatName");
let sortMode = 1;
document.title = `محصولات ${catName}`;

sortBtn.addEventListener("click", toggleSortMenu);
closeSortSectionBtn.addEventListener("click", toggleSortMenu);
sortSectionElem.addEventListener("click", preventClick);
window.addEventListener("load", fetchProductsList);
defaultBtn.addEventListener("click", () => changeSort(1, defaultBtn));
cheapBtn.addEventListener("click", () => changeSort(2, cheapBtn));
expensiveBtn.addEventListener("click", () => changeSort(3, expensiveBtn));

function toggleSortMenu() {
    if (sortSectionElem.classList.contains("active")) {
        sortSectionElem.classList.remove("active");
    } else {
        sortSectionElem.classList.add("active");
    }
}

function fetchProductsList() {
    let link = getLinkBySortMode();
    fetch(link)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقراری ارتباط با سرور");
            }
        })
        .then(data => {
            if (data.length) {
                generateProductList(data)
            } else {
                showEmtpyResultContainer();
            }
        })
        .catch(err => showModal(err.message));

}

function getLinkBySortMode() {
    let link = `http://localhost:3000/products?cat=${catName}`;
    if (subCatName) {
        link += `&subCat=${subCatName}`;
    }
    if (sortMode === 2) {
        link += `&_sort=price&_order=asc`;
    } else if (sortMode === 3) {
        link += `&_sort=price&_order=desc`;
    }
    return link;
}

function generateProductList(data) {
    removeAllChild(productListElem);

    let newFragmentList = document.createDocumentFragment();

    data.forEach(product => {
        let newPoductItem = createDiv("productItem");

        let newProductImage = createImg("productImg", product.img, "عکس محصول")

        let newProductInfoDiv = createDiv("productInfoDiv");

        let newProductName = createP("productName", product.name);

        let newProductPrice = createP("productPrice", `${product.price.toLocaleString()} تومان`);

        let newProductLink = createAnchor("productLink", "مشاهده محصول", `./product.html?product=${product.id}`);

        newProductInfoDiv.append(newProductName, newProductPrice, newProductLink)
        newPoductItem.append(newProductImage, newProductInfoDiv);
        newFragmentList.appendChild(newPoductItem);
    });
    productListElem.appendChild(newFragmentList);
}

function showEmtpyResultContainer() {
    mainContentContainer.style.display = "none";
    sortBtnContainer.style.display = "none";
    emtpyResultContainer.style.display = "flex";
}

function changeSort(value, element) {
    sortMode = value;
    fetchProductsList();
    toggleSortMenu();
    let activeElem = document.querySelector(".sortItemActive");
    activeElem.classList.remove("sortItemActive");
    element.classList.add("sortItemActive");

}