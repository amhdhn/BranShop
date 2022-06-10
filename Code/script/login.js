"use strict";
import { showModal, createRandomPass, checkLogged } from "./func.js";

const passToggleBtn = document.querySelector(".passToggle");
const passwordInput = document.querySelector(".passwordInput");
const emailInput = document.querySelector(".emailInput");
const confirmBtn = document.querySelector(".confirmBtn");
const msgTextElem = document.querySelector(".msgText");


passToggleBtn.addEventListener("click", togglePassInputType);
confirmBtn.addEventListener("click", handleLoginBtnClick);
window.addEventListener("load", checkLogged)

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

function handleLoginBtnClick(event) {
    let userEmail = emailInput.value;
    let userPass = passwordInput.value;
    if (userEmail === "" || userPass === "") {
        msgTextElem.innerText = "لطفا ایمیل و کلمه عبور را وارد کنید."
        msgTextElem.classList.add("active");
        return;
    }
    event.preventDefault();
    fetch(`http://localhost:3000/users?userName=${userEmail}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقراری ارتباط با سرور.");
            }
        })
        .then(data => {
            if (data.length) {
                if (data[0].password === userPass) {
                    changeTempCode(data[0]);
                } else {
                    msgTextElem.innerText = "کلمه عبور اشتباه است."
                    msgTextElem.classList.add("active");
                }
            } else {
                msgTextElem.innerText = "شما ثبت نام نکرده اید."
                msgTextElem.classList.add("active");
            }
        })
        .catch(err => showModal(err.message));

}

function changeTempCode(data) {
    let tempPass = createRandomPass()
    data.tempCode = tempPass;

    fetch("http://localhost:3000/users/" + data.id, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.status === 200) {
            let userData = {
                email: data.userName,
                pass: tempPass
            }
            localStorage.userInfo = JSON.stringify(userData);
            window.location = "./index.html";
        } else {
            throw new Error("خطایی رخ داده است.")
        }
    }).catch(err => showModal(err.message));
}