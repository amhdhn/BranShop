"use strict";
import { showModal, loadUserCartFormStorage, removeAllChild, createDiv, createImg, createAnchor, createP, createButton } from "./func.js";
const cartDetailsContainer = document.querySelector(".cartDetailsContainer");
const emptyCartContainer = document.querySelector('.emptyCartContainer');
const totalPriceSpan = document.querySelector(".totalPriceSpan");
const cartListElem = document.querySelector(".cartList");
const loadingContainer = document.querySelector(".loadingContainer");

let userCart = {};
userCart = loadUserCartFormStorage();
window.addEventListener("load", fetchCartDetailFormDB);


function fetchCartDetailFormDB() {
    let urls = [];
    for (const product in userCart) {
        urls.push(`http://localhost:3000/products/${userCart[product].id}`);
    }
    Promise.all(urls.map(u => fetch(u)))
        .then(res =>
            Promise.all(res.map(res => res.json()))
        ).then(data => {
            checkCartInfo(data)
        });

}

function checkCartInfo(data) {
    let newUserCart = {}
    let dataChanged = false;
    data.forEach(element => {

        // check product is valid and exist in stock
        if (Object.keys(element).length > 0) {
            let id = element.id;
            userCart[id].maxNumber = element.number;
            userCart[id].price = element.price;
            userCart[id].discount = element.discount;
            userCart[id].discountValue = element.discountValue;

            if (userCart[id].number > userCart[id].maxNumber) {
                userCart[id].number = userCart[id].maxNumber;
            }

            if (userCart[id].number > 0) {
                newUserCart[id] = userCart[id];
            } else {
                dataChanged = true;
            }
        } else {
            dataChanged = true;
        }
    });

    if (dataChanged) {
        showModal("سبد شما به علت عدم موجودی بعضی کالاها تغییر کرد.");
    }
    userCart = newUserCart;
    saveToStorage();
    addDataToDom();

}

function addDataToDom() {
    removeAllChild(cartListElem);

    if (Object.keys(userCart).length === 0) {
        cartDetailsContainer.style.display = "none";
        emptyCartContainer.classList.add("active");
    } else {
        calculateTotalPrice();
        generateCartList();
    }

}

function generateCartList() {
    let listFragment = document.createDocumentFragment();

    for (const product in userCart) {

        let newCartItem = createDiv("cartItem");

        let newProductImg = createImg("productImg", userCart[product].img, "تصویر محصول");

        let newProductInfoDiv = createDiv("productDetailsDiv");

        let productName = createAnchor("productName", userCart[product].name, `./product.html?product=${userCart[product].id}`);

        let productPrice = createP("productPrice", `قیمت واحد : ${userCart[product].price.toLocaleString()}`);

        let price = 0;

        if (userCart[product].discount) {
            price = (userCart[product].price * (100 - userCart[product].discountValue)) / 100;
        } else {
            price = userCart[product].price;

        }

        let productTotalPrice = createP("productTotalPrice", `قیمت کل : ${(price*userCart[product].number).toLocaleString()} تومان`);


        let newMangeNumberDiv = createDiv("manageProductNumberDiv");

        let newDecBtn = createButton("decreaseNumber", "remove", "کاهش تعداد محصول");
        newDecBtn.addEventListener("click", (event) => {
            userCart[product].number--;
            if (userCart[product].number < 1) {
                delete userCart[product];
            }
            saveToStorage();
            addDataToDom();
        });

        let newProductNumber = createP("numberInCart", `${userCart[product].number} عدد`);

        let newIncBtn = createButton("increaseNumber", "add", "افزایش تعداد محصول");
        newIncBtn.addEventListener("click", (event) => {
            if (userCart[product].number < userCart[product].maxNumber) {
                userCart[product].number++;
                saveToStorage();
                addDataToDom();
            }
        });
        let newProductRemove = createButton("productRemoverBtn", "close", "حذف محصول");
        newProductRemove.addEventListener("click", () => {
            delete userCart[product];
            saveToStorage();
            addDataToDom();
        });
        newMangeNumberDiv.append(newDecBtn, newProductNumber, newIncBtn);

        if (userCart[product].discount) {
            let productDiscount = document.createElement("p");
            productDiscount.classList.add("productDiscount");
            let discountValue = ((userCart[product].price * userCart[product].discountValue) / 100) * userCart[product].number;
            productDiscount.innerText = `تخفیف : ${discountValue.toLocaleString()} ( ${userCart[product].discountValue} درصد )`;
            newProductInfoDiv.append(productName, productPrice, productDiscount, productTotalPrice,
                newMangeNumberDiv);
        } else {

            newProductInfoDiv.append(productName, productPrice, productTotalPrice,
                newMangeNumberDiv);
        }

        newCartItem.append(newProductImg, newProductInfoDiv, newProductRemove);
        listFragment.appendChild(newCartItem);
    }
    cartListElem.appendChild(listFragment);
    loadingContainer.style.display = "none";
    cartDetailsContainer.classList.add("active");
}

function calculateTotalPrice() {
    let totalPrice = 0;
    for (const product in userCart) {
        let price = 0;
        if (userCart[product].discount) {
            price = (userCart[product].price * (100 - userCart[product].discountValue)) / 100;
        } else {
            price = userCart[product].price;
        }

        totalPrice += price * userCart[product].number;
    }
    totalPriceSpan.innerText = `${totalPrice.toLocaleString()} تومان`;
}


function saveToStorage() {
    localStorage.userCart = JSON.stringify(userCart);
}