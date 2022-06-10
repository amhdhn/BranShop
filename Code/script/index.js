'use strict';
import { showModal, startDragging, stopDragging, mouseMoveHandler, createDiv, createImg, createP, createAnchor } from "./func.js";

const dailyOfferListElem = document.querySelector(".dailyOfferList");
const dailyBtnDivElem = document.querySelector(".dailyBtnDiv");
const loadingDailyOffersElem = document.querySelector(".loadingDailyOffers");
const previousElem = document.querySelector(".previous");
const nextElem = document.querySelector(".next");
let dailyOfferItems = null;
let currentDailyPos = 0;
let changeOfferTimer = null;


window.addEventListener("load", fetchAllData);
previousElem.addEventListener("click", goNextElem);
nextElem.addEventListener("click", goPreviousElem);
dailyOfferListElem.addEventListener('mousedown', (Event) => startDragging(Event, dailyOfferListElem));
dailyOfferListElem.addEventListener('mouseup', stopDragging);
dailyOfferListElem.addEventListener('mouseleave', stopDragging);
dailyOfferListElem.addEventListener('mousemove', mouseMoveHandler);



function fetchAllData() {
    fetch("http://localhost:3000/products?discount=true")
        .then(res => {

            if (res.status === 200) {
                return res.json();
            } else {
                return new Error("خطا در برقراری ارتباط با سرور.");;
            }

        })
        .then(data => {
            dailyOfferListElem.style.display = "flex";
            dailyBtnDivElem.style.display = "flex";
            loadingDailyOffersElem.remove();
            generateOfferList(data);
        })
        .then(() => fetch("http://localhost:3000/categories"))
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                return new Error("خطا در برقراری ارتباط با سرور.");
            }
        })
        .then(data => {
            generateBodyCategoryList(data);
        })
        .then(() => fetch(`http://localhost:3000/products?cat_like=مردانه`))
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقراری ارتباط با سرور.");
            }
        })
        .then(data => {
            generateCatShowList(data);
        })
        .catch(err => showModal(err.message));
}


function generateOfferList(dataList) {
    let newListFragment = document.createDocumentFragment();
    if (dataList.length) {
        dataList.forEach(item => {
            const newDailyOfferItem = createDiv("dailyOfferItem");

            const newDailyOfferImg = createImg("dailyOfferImg", item.img, "تصویر محصول");

            const newDailyOfferDetails = createDiv("dailyOfferDetails");

            const newDailyOfferName = createP("dailyOfferName", item.name);

            const newDailyOfferSee = createAnchor("dailyOfferSee", "مشاهده محصول", `./product.html?product=${item.id}`);

            const newDailyOfferOriginalPrice = createP("dailyOfferOriginalPrice", item.price.toLocaleString());



            if (item.number > 0) {
                let priceAterDiscount = (item.price * (100 - item.discountValue)) / 100;
                const newDailyOfferDiscountPrice = createP("dailyOfferDiscountPrice", `${priceAterDiscount.toLocaleString()} تومان`);
                newDailyOfferDetails.append(newDailyOfferName, newDailyOfferOriginalPrice, newDailyOfferDiscountPrice, newDailyOfferSee);
            } else {
                const newDailyOfferDiscountPrice = createP("dailyOfferDiscountPrice", "ناموجود");
                newDailyOfferDetails.append(newDailyOfferName, newDailyOfferDiscountPrice, newDailyOfferSee);
            }

            newDailyOfferItem.append(newDailyOfferImg, newDailyOfferDetails);
            newListFragment.appendChild(newDailyOfferItem);

        });

        dailyOfferListElem.appendChild(newListFragment);
        dailyOfferItems = document.querySelectorAll(".dailyOfferItem");

        dailyOfferItems[currentDailyPos].classList.add("active");

        generateOfferTimer();
    }
}

function hideCurrentDailOfferItem() {

    dailyOfferItems[currentDailyPos].classList.remove("active");
}

function showNextDailOfferItem() {
    dailyOfferItems[currentDailyPos].classList.add("active");

}

function goNextElem() {
    clearInterval(changeOfferTimer);
    generateOfferTimer();
    hideCurrentDailOfferItem();
    currentDailyPos++;

    if (dailyOfferItems.length === currentDailyPos) {
        currentDailyPos = 0;
    }

    showNextDailOfferItem();
}

function goPreviousElem() {
    clearInterval(changeOfferTimer);
    generateOfferTimer();
    hideCurrentDailOfferItem();
    currentDailyPos--;

    if (currentDailyPos < 0) {
        currentDailyPos = dailyOfferItems.length - 1;
    }

    showNextDailOfferItem();
}

function generateOfferTimer() {
    changeOfferTimer = setInterval(() => {
        if (document.body.offsetWidth < 646) {
            goNextElem();
        }
    }, 5000);
}



////////////////// body container
const categoryBodyListElem = document.querySelector(".categoryBodyList");

categoryBodyListElem.addEventListener('mousedown', (Event) => startDragging(Event, categoryBodyListElem));
categoryBodyListElem.addEventListener('mouseup', stopDragging);
categoryBodyListElem.addEventListener('mouseleave', stopDragging);
categoryBodyListElem.addEventListener('mousemove', mouseMoveHandler);

function generateBodyCategoryList(data) {
    let newListFragment = document.createDocumentFragment();

    data.forEach(item => {
        let newSubCat = document.createElement("a");
        newSubCat.href = `./category.html?catName=${item.name}`;
        newSubCat.innerText = item.name;
        newSubCat.classList.add("categoryBodyItem");
        newListFragment.appendChild(newSubCat);
    });
    categoryBodyListElem.appendChild(newListFragment);
}

//////////////////////////////////////////////////////////////// catShowSection
const catShowListElem = document.querySelector(".catShowList");
const catShowSeeAllElem = document.querySelector(".catShowSeeAll");
const catShowTitleElem = document.querySelector(".catShowTitle");



catShowListElem.addEventListener('mousedown', (Event) => startDragging(Event, catShowListElem));
catShowListElem.addEventListener('mouseup', stopDragging);
catShowListElem.addEventListener('mouseleave', stopDragging);
catShowListElem.addEventListener('mousemove', mouseMoveHandler);

function generateCatShowList(data) {
    let newListFragment = document.createDocumentFragment();

    data.forEach(item => {
        let newCatShowItemElem = createDiv("catShowItem");

        let newCatShowImgElem = createImg("catShowImg", item.img, "تصویر محصول");

        let mewCatShowNameElem = createP("catShowName", item.name);

        let priceText = null;
        if (item.number > 0) {
            priceText = `${item.price.toLocaleString()} تومان`;
        } else {
            priceText = "ناموجود";
        }
        let mewCatShowPriceElem = createP("catShowPrice", priceText);

        let mewCatShowLinkElem = createAnchor("catShowSee", "مشاهده محصول", `./product.html?product=${item.id}`);

        newCatShowItemElem.append(newCatShowImgElem, mewCatShowNameElem, mewCatShowPriceElem, mewCatShowLinkElem);
        newListFragment.appendChild(newCatShowItemElem);

    });

    catShowListElem.appendChild(newListFragment);
}
/////////////////////////////////// userBtn
const userBtn = document.querySelector(".userBtn");

userBtn.addEventListener("click", handleUserBtn)

function handleUserBtn() {
    let isLogin = isUserLogin();
    if (isLogin) {
        window.location = "./userProfile.html";
    } else {
        window.location = "./login.html";
    }
}

function isUserLogin() {
    let savedUserInfo = localStorage.userInfo;
    return Boolean(savedUserInfo);
}