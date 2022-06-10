"use strict";
import { showModal, loadUserCartFormStorage, createRandomPass } from "./func.js";

const checkoutDataContainer = document.querySelector(".checkoutDataContainer");
const loadingContainer = document.querySelector(".loadingContainer");
const cartPriceBeforeDiscountSpan = document.querySelector(".cartPriceBeforeDiscountSpan");
const cartPriceDiscountSpan = document.querySelector(".cartPriceDiscountSpan");
const shippingPriceSpan = document.querySelector(".shippingPriceSpan");
const cartPriceAfterDiscountSpan = document.querySelector(".cartPriceAfterDiscountSpan");
const nameInput = document.querySelector(".nameInput");
const lNameInput = document.querySelector(".lNameInput");
const phoneInput = document.querySelector(".phoneInput");
const addressInput = document.querySelector(".addressInput");
const confirmBtn = document.querySelector(".confirmBtn");

let userCart = {};
let userInfo = {};
let shopInfo = {};

window.addEventListener("load", fetchInformation);
confirmBtn.addEventListener("click", purchaseCart);

getUserInfo();
userCart = loadUserCartFormStorage();

function getUserInfo() {
    let userInfoHolder = localStorage.userInfo;

    if (userInfoHolder) {
        userInfo = JSON.parse(userInfoHolder);
    } else {
        window.location = "./login.html";
    }
}



function fetchInformation() {
    let urls = [];
    for (const product in userCart) {
        urls.push(`http://localhost:3000/products/${userCart[product].id}`);
    }
    Promise.all(urls.map(u => fetch(u)))
        .then(res => Promise.all(res.map(res => res.json())))
        .then(data => { checkCartInfo(data); })
        .then(() => fetch(`http://localhost:3000/users?userName=${userInfo.email}`))
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error("عدم دسترسی به شبکه");
            }
        })
        .then(data => {
            generateUserInfoToDOM(data[0]);
            console.log(userCart)
        })
        .catch(err => {
            showModal("خطایی رخ داده است")
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

    if (Object.keys(newUserCart).length === 0) {
        window.location = "./userCart.html";
    } else {
        if (dataChanged) {
            showModal("سبد شما به علت عدم موجودی بعضی کالاها تغییر کرد.");
        }
        userCart = newUserCart;
        calculatePrices();
        saveToStorage();
    }

}

function calculatePrices() {
    let totalPrice = 0;
    let totalDiscount = 0;
    let totalPriceAfterDiscount = 0;

    for (const product in userCart) {
        totalPrice += userCart[product].price * userCart[product].number;
        totalDiscount += ((userCart[product].price * userCart[product].discountValue) / 100) * userCart[product].number

        let price = 0;
        if (userCart[product].discount) {
            price = (userCart[product].price * (100 - userCart[product].discountValue)) / 100;
        } else {
            price = userCart[product].price;
        }

        totalPriceAfterDiscount += price * userCart[product].number;
    }
    cartPriceBeforeDiscountSpan.innerText = `${totalPrice.toLocaleString()} تومان`;
    cartPriceDiscountSpan.innerText = `${totalDiscount.toLocaleString()} تومان`;
    shippingPriceSpan.innerText = `0 تومان`;
    cartPriceAfterDiscountSpan.innerText = `${totalPriceAfterDiscount.toLocaleString()} تومان`;
    shopInfo.price = totalPriceAfterDiscount;
}

function saveToStorage() {
    localStorage.userCart = JSON.stringify(userCart);
}

function generateUserInfoToDOM(userInfo) {
    nameInput.value = userInfo.firstName;
    lNameInput.value = userInfo.lastName;
    phoneInput.value = userInfo.phoneNumber;
    addressInput.value = userInfo.address;

    loadingContainer.style.display = "none";
    checkoutDataContainer.classList.add("active");
}

function purchaseCart() {
    if (nameInput.value && lNameInput.value && phoneInput.value && addressInput.value) {

        shopInfo.trackingCode = createRandomPass(11);
        shopInfo.details = getCartDetails();
        shopInfo.address = addressInput.value;
        shopInfo.phoneNumber = phoneInput.value;
        shopInfo.name = nameInput.value;
        shopInfo.lastName = lNameInput.value;
        shopInfo.userName = userInfo.email;
        shopInfo.progress = "سفارش ثبت شده";
        let urls = [];
        for (const product in userCart) {
            urls.push(`http://localhost:3000/products/${userCart[product].id}`);
        }
        Promise.all(urls.map(u => fetch(u)))
            .then(res => Promise.all(res.map(res => res.json())))
            .then(data => {
                return (data);
            })
            .then(products => {
                products.forEach(item => {
                    item.number -= userCart[item.id].number
                });
                return Promise.all(products.map(item => fetch(`http://localhost:3000/products/${item.id}`, {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(item)
                })))
            })
            .then(res => Promise.all(res.map(res => res.json())))
            .then(() => fetch("http://localhost:3000/shoppingData", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(shopInfo)
            }))
            .then(res => {
                if (res.status === 201) {
                    localStorage.removeItem("userCart");
                    showModal("سفارش شما با موفقیت ثبت شد.");
                    setTimeout(() => {
                        window.location = "/index.html";
                    }, 2000);
                } else {
                    throw new Error("خطا در برقراری ارتباط با سرور.");
                }
            })
            .catch(err =>
                showModal(err.message)
            );

    } else {
        showModal("لطفا تمامی اطلاعات کاربری را کامل کنید.")
    }
}

function getCartDetails() {
    let output = ": جزئیات سفارش \n";
    let counter = 1;
    for (const product in userCart) {
        output += `${counter} - ${userCart[product].name} : ${userCart[product].price.toLocaleString()} تومان ( ${userCart[product].number} عدد ) (${userCart[product].discountValue} % تخفیف) \n`;
        counter++;
    }
    output += "* مجموع خرید شما : " + cartPriceBeforeDiscountSpan.innerText + "\n";
    output += "* سود شما : " + cartPriceDiscountSpan.innerText + "\n";
    output += "* هزینه ارسال : " + shippingPriceSpan.innerText + "\n";
    output += "* مبلغ پرداخت شده : " + cartPriceAfterDiscountSpan.innerText + "\n";
    return output;
}