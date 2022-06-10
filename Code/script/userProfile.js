"use strict";
import { startDragging, stopDragging, mouseMoveHandler, showModal, removeAllChild, createDiv, createP } from "./func.js";
const sectionTitleListElem = document.querySelector(".sectionTitleList");
const loadingDivContainerElem = document.querySelector(".loadingDivContainer");
const userInfoBtn = document.querySelector(".userInfoBtn");
const logoutBtn = document.querySelector(".logoutBtn");
const changePassBtn = document.querySelector(".changePassBtn");
const historyBtn = document.querySelector(".historyBtn");
const changePassSectionElem = document.querySelector(".changePassSection");
const historySectionElem = document.querySelector(".historySection");

const userInfoSectionElem = document.querySelector(".userInfoSection");
const nameInput = document.querySelector(".nameInput");
const lNameInput = document.querySelector(".lNameInput");
const addressInput = document.querySelector(".addressInput");
const phoneNumberInput = document.querySelector(".phoneNumberInput");
const editInfoBtn = document.querySelector(".editInfo");
const confirmEditBtn = document.querySelector(".confirmEdit")

const historyListElem = document.querySelector(".historyList");
let userInfo = {};


sectionTitleListElem.addEventListener('mousedown', (Event) => startDragging(Event, sectionTitleListElem));
sectionTitleListElem.addEventListener('mouseup', stopDragging);
sectionTitleListElem.addEventListener('mouseleave', stopDragging);
sectionTitleListElem.addEventListener('mousemove', mouseMoveHandler);
userInfoBtn.addEventListener("click", showInfoSection);
changePassBtn.addEventListener("click", showChangePassSection);
historyBtn.addEventListener("click", showHistorySection);

editInfoBtn.addEventListener("click", enableUserInfoSectioninputs)
confirmEditBtn.addEventListener("click", updateUserData)
window.addEventListener("load", getUserInfo);
logoutBtn.addEventListener("click", logOutBtnHandler);


function logOutBtnHandler() {
    localStorage.removeItem("userInfo");
    window.location = "./login.html";
}

function getUserInfo() {
    let user = localStorage.userInfo;

    if (user) {
        user = JSON.parse(user);
        checkUserInfo(user);
    } else {
        window.location = "./login.html";
    }
}

function checkUserInfo(user) {

    fetch(`http://localhost:3000/users?userName=${user.email}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطایی رخ داده است.");
            }
        })
        .then(data => {
            if (data.length) {
                if (data[0].tempCode === user.pass) {
                    loadingDivContainerElem.style.display = "none";
                    userInfo.email = user.email;
                    generateDom(data[0]);
                } else {
                    localStorage.removeItem("userInfo");
                    window.location = "./login.html";
                }
            } else {

            }
        }).catch(err => showModal(err.message));

}

function generateDom(data) {

    userInfoSectionElem.classList.add("active");
    nameInput.value = data.firstName;
    lNameInput.value = data.lastName;
    addressInput.value = data.address;
    phoneNumberInput.value = data.phoneNumber;

    userInfo.firstName = data.firstName;
    userInfo.lastName = data.lastName;
    userInfo.address = data.address;
    userInfo.phoneNumber = data.phoneNumber;
    sectionTitleListElem.classList.add("active");
}

function enableUserInfoSectioninputs() {
    editInfoBtn.style.display = "none";
    confirmEditBtn.style.display = "block";

    nameInput.classList.add("active");
    lNameInput.classList.add("active");
    addressInput.classList.add("active");
    phoneNumberInput.classList.add("active");

}

function updateUserData() {
    let userName = nameInput.value;
    let userLastName = lNameInput.value;
    let userAddress = addressInput.value;
    let userPhoneNumber = phoneNumberInput.value;

    if (userName !== userInfo.firstName ||
        userLastName !== userInfo.lastName ||
        userAddress !== userInfo.address ||
        userPhoneNumber !== userInfo.phoneNumber
    ) {
        fetch(`http://localhost:3000/users?userName=${userInfo.email}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error("خطایی رخ داده است.")
                }
            })
            .then(data => {
                if (data.length) {
                    return data[0];
                } else {
                    throw new Error("خطایی رخ داده است.");
                }
            })
            .then(userData => {
                userData.firstName = userName;
                userData.lastName = userLastName;
                userData.phoneNumber = userPhoneNumber;
                userData.address = userAddress;

                return fetch(`http://localhost:3000/users/${userData.id}`, {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(userData)
                })
            })
            .then(res => {
                if (res.status === 200) {
                    showModal("حساب کاربری با موفقیت به روز شد.")
                    disableUserInfoSectioninputs();
                } else {
                    throw new Error("خطایی رخ داده است.");

                }
            }).catch(err => {
                showModal(err.message);
            });
    } else {
        disableUserInfoSectioninputs();
    }
}

function disableUserInfoSectioninputs() {

    editInfoBtn.style.display = "";
    confirmEditBtn.style.display = "";

    nameInput.classList.remove("active");
    lNameInput.classList.remove("active");
    addressInput.classList.remove("active");
    phoneNumberInput.classList.remove("active");

}

function showInfoSection() {
    hideAllSections();
    userInfoSectionElem.classList.add("active");
    userInfoBtn.classList.add("active");
}

function showChangePassSection() {
    hideAllSections();
    changePassSectionElem.classList.add("active");
    changePassBtn.classList.add("active");
}

function showHistorySection() {

    hideAllSections();
    loadingDivContainerElem.style.display = "";
    historyBtn.classList.add("active");
    fetchHistoryData();

    historySectionElem.classList.add("active");
    loadingDivContainerElem.style.display = "none";
}

function hideAllSections() {
    loadingDivContainerElem.style.display = "none";
    userInfoSectionElem.classList.remove("active");
    changePassSectionElem.classList.remove("active");
    historySectionElem.classList.remove("active");
    userInfoBtn.classList.remove("active");
    changePassBtn.classList.remove("active");
    historyBtn.classList.remove("active");
}
////////////////////////////////////////////////// change password section
const currentPassInput = document.querySelector(".currentPassInput");
const newPassInput = document.querySelector(".newPassInput");
const confirmPassInput = document.querySelector(".confirmPassInput");
const confirmEditPassBtn = document.querySelector(".confirmEditPass");

confirmEditPassBtn.addEventListener("click", checkPassValidation);

function checkPassValidation(Event) {
    Event.preventDefault();
    let userPass = currentPassInput.value;
    let newUserPass = newPassInput.value;
    let newUserConfirmPass = confirmPassInput.value;
    if (userPass && newUserPass && newUserConfirmPass) {
        if (newUserPass === newUserConfirmPass) {
            fetch(`http://localhost:3000/users?userName=${userInfo.email}`)
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        throw new Error("خطایی رخ داده است.")
                    }
                })
                .then(data => {
                    if (data.length) {
                        if (data[0].password === userPass) {
                            return data[0];
                        } else {
                            throw new Error("کلمه عبور وارد شده صحیح نمی باشد.");
                        }
                    } else {
                        throw new Error("خطایی رخ داده است.");
                    }
                })
                .then(userData => {
                    userData.password = userPass;
                    return fetch(`http://localhost:3000/users/${userData.id}`, {
                        method: "PUT",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(userData)
                    })
                })
                .then(res => {
                    if (res.status === 200) {
                        currentPassInput.value = "";
                        newPassInput.value = "";
                        confirmPassInput.value = "";
                        showModal('کلمه عبور با موفقیت تغییر کرد.');
                    } else {
                        throw new Error("خطایی رخ داده است.");

                    }
                }).catch(err => {
                    showModal(err.message);
                });
        } else {
            showModal("کلمه عبور جدید با تکرار آن مطابقت ندارد.")
        }
    } else {
        showModal("لطفا تمامی کادر ها را کامل کنید.")

    }

}
////////////////////////////////////////////////// history section
function fetchHistoryData() {
    fetch(`http://localhost:3000/shoppingData?userName=${userInfo.email}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطایی رخ داده است");
            }
        })
        .then(data => {
            generateHistoryList(data);
        })
}

function generateHistoryList(historyList) {
    removeAllChild(historyListElem);
    if (historyList.length) {
        let newListFragment = document.createDocumentFragment();
        historyList.forEach(item => {
            let newHistoryItemDiv = createDiv("historyItem");

            let newHistoryNameElem = createP("historyName", `نام و نام خانوادگی : ${item.name} ${item.lastName}`);

            let newHistoryPrice = createP("historyPrice", `جمع کل : ${item.price.toLocaleString()} تومان`);

            let newHistoryAddress = createP("historyAddress", `آدرس : ${item.address}`);

            let newHistoryPhoneNumber = createP("historyPhoneNumber", `شماره تلفن : ${item.phoneNumber}`);

            let newHistoryState = createP("historyCode", `کد پیگیری : ${item.trackingCode}`);

            let newHistoryProgress = createP("historyProgress", `وضعیت : ${item.progress}`);

            let newHistoryDetails = createP("historyDetails", `${item.details}`);

            newHistoryItemDiv.append(newHistoryNameElem, newHistoryPrice, newHistoryAddress, newHistoryPhoneNumber, newHistoryState, newHistoryProgress, newHistoryDetails);

            newListFragment.appendChild(newHistoryItemDiv);
        });
        historyListElem.appendChild(newListFragment);
    } else {

        let noHistoryFound = createP("noHistoryFound", "تاریخچه ی خریدی وجود ندارد.");
        historyListElem.appendChild(noHistoryFound);

    }
}