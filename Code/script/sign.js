"use strict";
import { createRandomPass, checkLogged, showModal } from './func.js';
const emailInput = document.querySelector(".emailInput");
const passwordInput = document.querySelector(".passwordInput");
const nameInput = document.querySelector(".nameInput");
const lNameInput = document.querySelector(".lNameInput");
const phoneInput = document.querySelector(".phoneInput");
const addressInput = document.querySelector(".addressInput");
const confirmBtn = document.querySelector(".confirmBtn");
const msgTextElem = document.querySelector(".msgText");
const passToggleBtn = document.querySelector(".passToggle");


passToggleBtn.addEventListener("click", togglePassInputType);
confirmBtn.addEventListener("click", confirmBtnClickHandler);
window.addEventListener("load", checkLogged);

function togglePassInputType(event) {
    event.preventDefault();

    if (passToggleBtn.innerText === "visibility") {
        passToggleBtn.innerText = "visibility_off";
        passwordInput.type = "text";
    } else {
        passToggleBtn.innerText = "visibility";
        passwordInput.type = "password";
    }
}

function confirmBtnClickHandler(event) {
    event.preventDefault();

    let userInfo = {
        userName: emailInput.value,
        password: passwordInput.value,
        firstName: nameInput.value,
        lastName: lNameInput.value,
        phoneNumber: phoneInput.value,
        address: addressInput.value,
        tempCode: ''
    }
    userInfo.tempCode = createRandomPass();

    let isInputFiled = true;
    for (const key in userInfo) {
        if (userInfo[key] === "") {
            isInputFiled = false;
        }
    }

    if (!isInputFiled) {

        msgTextElem.innerText = "لطفا تمامی فیلد هارا به صورت صحیح کامل کنید.";
        msgTextElem.classList.add("active");
        location.href = "#confirmBtn"
        return;
    } else {
        msgTextElem.classList.remove("active");
    }


    fetch(`http://localhost:3000/users?userName=${userInfo.userName}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقراری ارتباط با سرور.");
            }
        })
        .then(data => {

            if (data.length) {

                msgTextElem.innerText = "شما قبلا ثبت نام کرده اید."
                msgTextElem.classList.add("active");
                throw new Error("ثبت نام انجام نشد. شما قبلا ثبت نام کرده اید.")

            }
        })
        .then(() => fetch(`http://localhost:3000/users`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userInfo)
        }))
        .then(res => {
            let userData = {
                email: userInfo.userName,
                pass: userInfo.tempCode
            }
            if (res.ok) {
                localStorage.userInfo = JSON.stringify(userData);
                window.location = "./index.html";
            } else {
                throw new Error("عدم دسترسی به سرور");
            }
        })
        .catch(err => {
            showModal(err.message);
        });


}