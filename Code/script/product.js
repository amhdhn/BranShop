'use strict';
import { showModal, startDragging, stopDragging, mouseMoveHandler, loadUserCartFormStorage, createDiv, createImg, createAnchor, createP } from "./func.js";

const productMainImg = document.querySelector(".productMainImg");
const productNameElem = document.querySelector(".productName");
const productDiscountValueElem = document.querySelector(".productDiscountValue");
const productDiscountElem = document.querySelector(".productDiscount");
const productPriceElem = document.querySelector(".productPrice");
const productDescribeElem = document.querySelector(".productDescribe");
const addToCartBtn = document.querySelector(".addToCartBtn");
const manageProductNumberDivElem = document.querySelector(".manageProductNumberDiv");
const decreaseNumberBtn = document.querySelector(".decreaseNumber");
const numberInCartElem = document.querySelector(".numberInCart");
const increaseNumberBtn = document.querySelector(".increaseNumber");
const remainProductNumberElem = document.querySelector(".remainProductNumber");
const productNotExistElem = document.querySelector(".productNotExist");


let searchParams = new URLSearchParams(window.location.search);
let productId = searchParams.get("product");
let userCart = {};
let productInfo = null;
userCart = loadUserCartFormStorage();

addToCartBtn.addEventListener("click", addToCartHandler);
increaseNumberBtn.addEventListener("click", increaseProductInCart);
decreaseNumberBtn.addEventListener("click", decreaseProductInCart);
window.addEventListener("load", getProductInfo);

function getProductInfo() {
    fetch(`http://localhost:3000/products/${productId}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقراری ارتباط با سرور.");
            }
        }).then(data => {
            setProductInfo(data);
            return data.cat;
        }).then(catName =>
            fetch(`http://localhost:3000/products?cat=${catName}`)
        ).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقراری ارتباط با سرور.");
            }
        }).then(data => {
            generateRecomendedList(data);
        })
        .catch(err => showModal(err.message));
}

function setProductInfo(product) {
    document.title = product.name;


    productInfo = {...product };
    productMainImg.src = product.img;
    productMainImg.alt = "productImg";


    productNameElem.innerText = product.name;

    if (product.discount) {
        productDiscountElem.classList.add("active");
        productDiscountElem.innerText = product.price.toLocaleString();

        productDiscountValueElem.classList.add("active");
        productDiscountValueElem.innerText = `% ${product.discountValue}  تخفیف`;

        let priceAterDiscount = (product.price * (100 - product.discountValue)) / 100;
        productPriceElem.innerText = `${priceAterDiscount.toLocaleString()} تومان`;
    } else {
        productPriceElem.innerText = `${product.price.toLocaleString()} تومان`;
    }

    productDescribeElem.innerText = product.info;
    if (product.number === 0) {
        productNotExistElem.classList.add("active");
    } else {
        let isInCart = isProductInCart();

        if (isInCart) {
            addToCartBtn.style.display = "none";
            manageProductNumberDivElem.classList.add("active");
            numberInCartElem.innerText = userCart[productId].number;
        } else {
            addToCartBtn.style.display = "flex";

        }

        addToCartBtn.style.pointerEvents = "unset";

        if (+product.number < 10) {
            remainProductNumberElem.innerText = `${product.number} عدد در انبار باقی مانده است.`;
            remainProductNumberElem.classList.add("active")
        }

    }

}


function isProductInCart() {
    if (userCart[productId]) {
        return true;
    } else {
        return false;
    }
}

function addToCartHandler() {

    let isInCart = isProductInCart(productId);
    if (isInCart) {
        increaseProductInCart();
    } else {
        let product = {
            name: productInfo.name,
            id: productInfo.id,
            price: productInfo.price,
            number: 1,
            maxNumber: productInfo.number,
            img: productInfo.img,
            discount: productInfo.discount,
            discountValue: productInfo.discountValue,
        }
        userCart[productId] = product;
        addToCartBtn.style.display = "none";
        manageProductNumberDivElem.classList.add("active");
        numberInCartElem.innerText = userCart[productId].number;
        saveToStorage();
    }
}

function increaseProductInCart() {
    if (userCart[productId].number < productInfo.number) {
        userCart[productId].number++;
        numberInCartElem.innerText = userCart[productId].number;

    }
    saveToStorage();
}

function decreaseProductInCart() {
    userCart[productId].number--;
    if (userCart[productId].number > 0) {
        numberInCartElem.innerText = userCart[productId].number;
    } else {
        addToCartBtn.style.display = "";
        manageProductNumberDivElem.classList.remove("active");
        delete userCart[productId];
    }
    saveToStorage();
}

function saveToStorage() {
    localStorage.userCart = JSON.stringify(userCart);
}
// recomendedProductList
const recomendedProductListElem = document.querySelector(".recomendedProductList");
const recomendedProductContainer = document.querySelector(".recomendedProductContainer");


recomendedProductListElem.addEventListener('mousedown', (Event) => startDragging(Event, recomendedProductListElem));
recomendedProductListElem.addEventListener('mouseup', stopDragging);
recomendedProductListElem.addEventListener('mouseleave', stopDragging);
recomendedProductListElem.addEventListener('mousemove', mouseMoveHandler);

function generateRecomendedList(data) {
    let newListFragment = document.createDocumentFragment();

    data.forEach(item => {
        if (item.id !== +productId) {
            let newRecParentItem = createDiv("recomendedProductItem");

            let newRecImg = createImg("recomendedProductImg", item.img, "عکس محصول");

            let newRecDivDetails = createDiv("recomendedProductDetails");

            let newRecName = createP("recomendedProductName", item.name);

            let priceText = null;
            if (item.number > 0) {
                priceText = `${item.price.toLocaleString()} تومان`;
            } else {
                priceText = "ناموجود";
            }
            let newRecPrice = createP("recomendedProductPrice", priceText);

            let newRecLink = createAnchor("recomendedProductShow", "مشاهده محصول", `product.html?product=${item.id}`);

            newRecDivDetails.append(newRecName, newRecPrice, newRecLink);
            newRecParentItem.append(newRecImg, newRecDivDetails);
            newListFragment.appendChild(newRecParentItem);
        }

    });

    recomendedProductListElem.appendChild(newListFragment);
    recomendedProductContainer.classList.add("active");
}