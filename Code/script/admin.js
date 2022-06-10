"use strict";
import { showModal, removeAllChild, preventClick, createInput, createTextArea, createLabel, createDiv, createButton, createP, createImg, createOption, scrollToTop } from "./func.js";

const manageUsersBtn = document.querySelector(".manageUsersBtn");
const manageProductBtn = document.querySelector(".manageProductBtn");
const managePurchaseBtn = document.querySelector(".managePurchaseBtn");
const usersSectionElem = document.querySelector(".usersSection");
const productSectionElem = document.querySelector(".productSection");
const purchaseSectionElem = document.querySelector(".purchaseSection");

let deleteItem = null;
let deleteLink = null;
let deleteMode = null;

manageUsersBtn.addEventListener("click", showUserSection);
manageProductBtn.addEventListener("click", showProductSection);
managePurchaseBtn.addEventListener("click", showPurchaseSection);
window.addEventListener("load", showUserSection);


function showUserSection() {
    hideAciveSection();
    usersSectionElem.style.display = "block";
    manageUsersBtn.classList.add("active");
    fetchUsersData();

}

function showProductSection() {
    hideAciveSection();
    productSectionElem.style.display = "block";
    manageProductBtn.classList.add("active");
    fetchProductsData();

}

function showPurchaseSection() {
    hideAciveSection();
    purchaseSectionElem.style.display = "block";
    managePurchaseBtn.classList.add("active");
    fetchPurchaseData();
}

function hideAciveSection() {
    usersSectionElem.style.display = "none";
    productSectionElem.style.display = "none";
    purchaseSectionElem.style.display = "none";

    let activeTabItem = document.querySelector(".sectionTitleItem.active");
    activeTabItem.classList.remove("active");
}
///////////////////////////////// manage purchase section
const purchaseListElem = document.querySelector(".purchaseList");
const searchPurchaseInput = document.querySelector(".searchPurchaseInput");
const searchPurchaseConfirmBtn = document.querySelector(".searchPurchaseConfirm");
const searchPurchaseResultElem = document.querySelector(".searchPurchaseResult");
const searchPurchaseResultSpan = document.querySelector(".searchPurchaseResultSpan");



let searchPurchaseResult = null;
searchPurchaseConfirmBtn.addEventListener("click", handlePurchaseSearchConfirm);
searchPurchaseInput.addEventListener("keyup", handlePurchaseSearchInput);
searchPurchaseResultElem.addEventListener("click", clearPurchaseSearchResult);


function fetchPurchaseData() {
    let link = `http://localhost:3000/shoppingData`;
    if (searchPurchaseResult) {
        link += `?trackingCode=${searchPurchaseResult}`;
    }
    fetch(link)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقرای ارتباط با سرور.");
            }
        })
        .then(data => {
            if (data.length) {
                generatePurchaseList(data);
            } else {
                generateNoResultItem(purchaseListElem);
            }
        })
        .catch(err => showModal(err.message));
}

function generatePurchaseList(data) {
    removeAllChild(purchaseListElem);
    let newListFragment = document.createDocumentFragment();
    data.forEach(purchase => {
        let newPurchaseItem = createDiv("purchaseItem");
        newPurchaseItem.dataset.id = purchase.id;

        let newNameDiv = createDiv("itemDiv");
        let newNameLabel = createLabel("نام");
        let newNameInput = createInput("purchaseName", purchase.name, "لطفا نام خریدار را وارد کنید.", "text");
        newNameDiv.append(newNameLabel, newNameInput);

        let newLastNameDiv = createDiv("itemDiv");
        let newLastNameLabel = createLabel("نام خانوادگی");
        let newLastNameInput = createInput("purchaseLastName", purchase.lastName, "لطفا نام خانوادگی خریدار را وارد کنید.", "text");
        newLastNameDiv.append(newLastNameLabel, newLastNameInput);

        let newAddressDiv = createDiv("itemDiv");
        let newAddressLabel = createLabel("آدرس");
        let newAddressInput = createInput("purchaseAddress", purchase.address, "لطفا آدرس خریدار را وارد کنید.", "text");
        newAddressDiv.append(newAddressLabel, newAddressInput);

        let newPhoneNumberDiv = createDiv("itemDiv");
        let newPhoneNumberLabel = createLabel("شماره تلفن");
        let newPhoneNumberInput = createInput("purchasePhoneNumber", purchase.phoneNumber, "لطفا آدرس خریدار را وارد کنید.", "text");
        newPhoneNumberDiv.append(newPhoneNumberLabel, newPhoneNumberInput);

        let newPriceDiv = createDiv("itemDiv");
        let newPriceLabel = createLabel("مبلغ");
        let newPriceInput = createInput("purchasePrice", purchase.price, "لطفا مبلغ  را وارد کنید.", "text");
        newPriceDiv.append(newPriceLabel, newPriceInput);

        let newUserNameDiv = createDiv("itemDiv");
        let newUserNameLabel = createLabel("ایمیل");
        let newUserNameInput = createInput("purchaseUserName", purchase.userName, "لطفا ایمیل را وارد کنید.", "text");
        newUserNameDiv.append(newUserNameLabel, newUserNameInput);

        let newDetailsDiv = createDiv("itemDiv");
        let newDetailsLabel = createLabel("جزئیات خرید");
        let newDetailsInput = createTextArea("purchaseDetails", purchase.details, "جزئیات خرید را وارد کنید.", true);
        newDetailsInput.classList.add("customScrollBar");
        newDetailsDiv.append(newDetailsLabel, newDetailsInput);

        let newTrackingCodeDiv = createDiv("itemDiv");
        let newTrackingCodeLabel = createLabel("کد رهگیری");
        let newTrackingCodeInput = createInput("purchaseTrackingCode", purchase.trackingCode, "کد رهگیری  را وارد کنید.", "text");
        newTrackingCodeDiv.append(newTrackingCodeLabel, newTrackingCodeInput);

        let newProgressDiv = createDiv("itemDiv");
        let newProgressLabel = createLabel("وضعیت سفارش");
        let newProgressInput = createInput("purchaseProgress", purchase.progress, "وضعیت سفارش را وارد کنید.", "text");
        newProgressDiv.append(newProgressLabel, newProgressInput);

        // add edit and remove btn to items
        let newControllDiv = createDiv("controllDiv");
        let newEditPurchaseBtn = createButton("editUser", "edit_note", "ویرایش سفارش");
        newEditPurchaseBtn.addEventListener("click", () => {
            newNameInput.classList.add("enable");
            newLastNameInput.classList.add("enable");
            newAddressInput.classList.add("enable");
            newPhoneNumberInput.classList.add("enable");
            newPriceInput.classList.add("enable");
            newUserNameInput.classList.add("enable");
            newDetailsInput.readOnly = false;
            newTrackingCodeInput.classList.add("enable");
            newProgressInput.classList.add("enable");
            newControllDiv.style.display = "none";
            newEditDiv.style.display = "grid";
        });
        let newDeletePurchaseBtn = createButton("deleteUser", "delete", "حذف سفارش");
        newDeletePurchaseBtn.addEventListener("click", () => {
            deleteItem = newPurchaseItem.dataset.id;
            deleteLink = "http://localhost:3000/shoppingData/";
            deleteMode = "purchase";
            deleteModalElem.classList.add("active");
        });
        newControllDiv.append(newEditPurchaseBtn, newDeletePurchaseBtn);

        // add save and cancel btn to item
        let newEditDiv = createDiv("editDiv");

        let newSavePuchaseBtn = createButton("saveUser", "ذخیره");
        newSavePuchaseBtn.addEventListener("click", () => {

            if (newNameInput.value === "" ||
                newLastNameInput.value === "" ||
                newAddressInput.value === "" ||
                newPhoneNumberInput.value === "" ||
                newPriceInput.value === "" ||
                newUserNameInput.value === "" ||
                newDetailsInput.value === "" ||
                newTrackingCodeInput.value === "" ||
                newProgressInput.value === "") {
                showModal("لطفا تمامی کادر ها را کامل کنید.")
            } else {

                let purchaseInfo = {
                    price: newPriceInput.value,
                    trackingCode: newTrackingCodeInput.value,
                    details: newDetailsInput.value,
                    address: newAddressInput.value,
                    phoneNumber: newPhoneNumberInput.value,
                    name: newNameInput.value,
                    lastName: newLastNameInput.value,
                    userName: newUserNameInput.value,
                    progress: newProgressInput.value,
                    id: newPurchaseItem.dataset.id
                };

                fetch(`http://localhost:3000/shoppingData/${purchaseInfo.id}`, {
                        method: "PUT",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(purchaseInfo)
                    })
                    .then(res => {
                        if (res.status === 200) {
                            showModal("اطلاعات سفارش به روز شد.")
                            fetchPurchaseData();
                        } else {
                            throw new Error("خطایی رخ داده است دوباره تلاش کنید.")
                        }
                    })
                    .catch(err => showModal(err.message));
            }
        });

        let newCancelPurchaseBtn = createButton("cancelUser", "لغو");
        newCancelPurchaseBtn.addEventListener("click", () => {
            fetchPurchaseData();
        });
        newEditDiv.append(newSavePuchaseBtn, newCancelPurchaseBtn);


        newPurchaseItem.append(newNameDiv, newLastNameDiv, newAddressDiv, newPhoneNumberDiv, newPriceDiv, newUserNameDiv, newTrackingCodeDiv, newProgressDiv, newDetailsDiv, newControllDiv, newEditDiv);
        newListFragment.appendChild(newPurchaseItem);
    });
    purchaseListElem.appendChild(newListFragment);
}


function handlePurchaseSearchConfirm() {
    searchPurchaseResult = searchPurchaseInput.value;
    if (searchPurchaseResult !== "") {
        searchPurchaseResultSpan.innerText = searchPurchaseResult;
        searchPurchaseResultElem.classList.add("active");
        fetchPurchaseData();
        searchPurchaseInput.value = "";
    }
    scrollToTop();
}

function handlePurchaseSearchInput(Event) {
    if (Event.key === "Enter") {
        handlePurchaseSearchConfirm();
        searchPurchaseInput.blur();
    }
}

function clearPurchaseSearchResult() {
    searchPurchaseResult = null;
    fetchPurchaseData();
    searchPurchaseInput.value = "";
    searchPurchaseResultElem.classList.remove("active");
    scrollToTop();
}
///////////////////////////////// manage product section
const productListElem = document.querySelector(".productList");
const editProductContnainer = document.querySelector(".editProductContnainer");
const editProductDivElem = document.querySelector(".editProductDiv");
const closeEditContainerBtn = document.querySelector(".closeEditContainerBtn");
const editProductImg = document.querySelector(".editProductImg")
const editProductNameInput = document.querySelector(".editProductName")
const editProductPriceInput = document.querySelector(".editProductPrice")
const editProductNumberInput = document.querySelector(".editProductNumber")
const editProductDiscountInput = document.querySelector(".editProductDiscount")
const editProductInfoInput = document.querySelector(".editProductInfo")
const cancelEditProductBtn = document.querySelector(".cancelEditProduct")
const confirmEditProductBtn = document.querySelector(".confirmEditProduct")
const catSelect = document.querySelector(".catSelect");
const subCatSelect = document.querySelector(".subCatSelect");
const searchProductInput = document.querySelector(".searchProductInput");
const searchProductConfirmBtn = document.querySelector(".searchProductConfirm");
const searchProductResultElem = document.querySelector(".searchProductResult");
const searchProductResultSpan = document.querySelector(".searchProductResultSpan");

let productId = null;
let searchProductResult = null;
let catData = null;

cancelEditProductBtn.addEventListener("click", hideEditContainer);
confirmEditProductBtn.addEventListener("click", confrimEditOperaiton);
catSelect.addEventListener("change", () => generateSubCatList());
closeEditContainerBtn.addEventListener("click", hideEditContainer);
editProductDivElem.addEventListener("click", preventClick);
searchProductConfirmBtn.addEventListener("click", handleProductSearchConfirm);
searchProductInput.addEventListener("keyup", handleProductSearchInput);
searchProductResultElem.addEventListener("click", clearProductSearchResult);

function fetchProductsData() {
    let link = `http://localhost:3000/products`;
    if (searchProductResult) {
        link += `?name_like=${searchProductResult}`;
    }
    fetch(link)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقرای ارتباط با سرور.");
            }
        })
        .then(data => {
            if (data.length) {
                generateProductsList(data);
            } else {
                generateNoResultItem(productListElem);
            }
        })
        .then(() => fetch(`http://localhost:3000/categories`))
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقرای ارتباط با سرور.");
            }
        })
        .then(data => {
            catData = data;
            generateCatList()
        })
        .catch(err => showModal(err.message));
}

function generateProductsList(data) {
    removeAllChild(productListElem);
    let newListFragment = document.createDocumentFragment();

    data.forEach(product => {
        let newProductItem = createDiv("productItem");
        newProductItem.dataset.id = product.id;

        let newProductImg = createImg("productImg", product.img, "product Image");

        let newProductInfoDiv = createDiv("productInfoDiv");

        let newNameDiv = createDiv("infoDiv");
        let newNameLabel = createLabel("نام :");
        let newProductName = createP("productName", product.name);
        newNameDiv.append(newNameLabel, newProductName);

        let newPriceDiv = createDiv("infoDiv");
        let newPriceLabel = createLabel("قیمت :");
        let newProductPrice = createP("productPrice", product.price.toLocaleString());
        newPriceDiv.append(newPriceLabel, newProductPrice);

        let newNumberDiv = createDiv("infoDiv");
        let newNumberLabel = createLabel("تعداد :");
        let newProductNumber = createP("productNumber", product.number);
        newNumberDiv.append(newNumberLabel, newProductNumber);

        let newDiscountDiv = createDiv("infoDiv");
        let newDiscountLabel = createLabel("تخفیف :");
        let newProductDiscount = createP("productDiscount", product.discountValue);
        newDiscountDiv.append(newDiscountLabel, newProductDiscount);

        let newDescribeDiv = createDiv("infoDiv");
        let newDescribeLabel = createLabel("توضیحات :");
        let newProductDescribe = createP("productDescribe", product.info);
        newDescribeDiv.append(newDescribeLabel, newProductDescribe);

        let newCatDiv = createDiv("infoDiv");
        let newCatLabel = createLabel("دسته :");
        let newProductCat = createP("productCat", product.cat);
        newCatDiv.append(newCatLabel, newProductCat);

        let newSubCatDiv = createDiv("infoDiv");
        let newSubCatLabel = createLabel("زیر دسته :");
        let newProductSubCat = createP("productSubCat", product.subCat);
        newSubCatDiv.append(newSubCatLabel, newProductSubCat);

        let newControllDiv = createDiv("controllDiv");

        let newEditUserBtn = createButton("editUser", "edit_note", "ویرایش کاربر");
        newEditUserBtn.addEventListener("click", () => {
            editProductContnainer.style.display = "flex";
            editProductImg.src = product.img;
            editProductNameInput.value = product.name;
            editProductPriceInput.value = product.price;
            editProductNumberInput.value = product.number;
            editProductDiscountInput.value = product.discountValue;
            editProductInfoInput.value = product.info;
            catSelect.value = product.cat;
            generateSubCatList(product.subCat);
            productId = newProductItem.dataset.id;
        });

        let newDeleteUserBtn = createButton("deleteUser", "delete", "حذف کاربر");
        newDeleteUserBtn.addEventListener("click", () => {
            deleteItem = newProductItem.dataset.id;
            deleteLink = "http://localhost:3000/products/";
            deleteMode = "product";
            deleteModalElem.classList.add("active");
        });
        newControllDiv.append(newEditUserBtn, newDeleteUserBtn);


        newProductInfoDiv.append(newNameDiv, newPriceDiv, newNumberDiv, newDiscountDiv, newDescribeDiv, newCatDiv, newSubCatDiv, newControllDiv);

        newProductItem.append(newProductImg, newProductInfoDiv);

        newListFragment.appendChild(newProductItem);
    });
    productListElem.appendChild(newListFragment);

}

function hideEditContainer() {
    editProductContnainer.style.display = "none";
    editProductNameInput.value = null;
    editProductPriceInput.value = null;
    editProductNumberInput.value = null;
    editProductDiscountInput.value = null;
    editProductInfoInput.value = null;
    productId = null;
}

function generateCatList() {
    removeAllChild(catSelect);

    let newListFragment = document.createDocumentFragment();

    catData.forEach(cat => {
        let newCatOption = createOption(cat.name, cat.name);
        newListFragment.appendChild(newCatOption);
    });
    catSelect.appendChild(newListFragment);

}

function generateSubCatList(choicedSubCat) {
    removeAllChild(subCatSelect);

    let newListFragment = document.createDocumentFragment();
    let currentCatName = catSelect.value;
    let subCatArray = null;
    catData.some(cat => {
        if (cat.name === currentCatName) {
            subCatArray = cat.subCat;
            return true;
        }
    })
    subCatArray.forEach(subCat => {
        let newSubCatOption = createOption(subCat, subCat);
        newListFragment.appendChild(newSubCatOption);
    });
    subCatSelect.appendChild(newListFragment);
    if (choicedSubCat) {
        subCatSelect.value = choicedSubCat;
    } else {
        subCatSelect.value = subCatArray[0];
    }
}

function confrimEditOperaiton() {
    let newProductImg = editProductImg.src;
    let newProductName = editProductNameInput.value;
    let newProductPrice = +editProductPriceInput.value;
    let newProductNumber = +editProductNumberInput.value;
    let newProductDiscount = +editProductDiscountInput.value
    let newProductInfo = editProductInfoInput.value;
    let newProductCat = catSelect.value;
    let newProductSubCat = subCatSelect.value;

    if (newProductImg === "" |
        newProductName === "" |
        newProductPrice === "" |
        newProductNumber === "" |
        newProductDiscount === "" |
        newProductInfo === "" |
        newProductCat === "" |
        newProductSubCat === "") {
        showModal("لطفا تمامی کادر هارا کامل کنید.");
        return;
    }
    let discountFlag = false;
    if (newProductDiscount > 0) {
        discountFlag = true;
    }

    let productObject = {
        cat: newProductCat,
        discount: discountFlag,
        discountValue: newProductDiscount,
        img: newProductImg,
        name: newProductName,
        number: newProductNumber,
        price: newProductPrice,
        subCat: newProductSubCat,
        id: productId,
        info: newProductInfo
    }
    if (productId) {
        fetch(`http://localhost:3000/products/${productId}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(productObject)
            })
            .then(res => {
                if (res.status === 200) {
                    hideEditContainer();
                    fetchProductsData();
                    showModal("محصول با موفقیت به روز شد.");
                } else {
                    throw new Error("خطا در برقراری ارتباط با سرور.");
                }
            })
            .catch(err => showModal(err.message));
    }
}

function handleProductSearchConfirm() {
    searchProductResult = searchProductInput.value;
    if (searchProductResult !== "") {
        searchProductResultSpan.innerText = searchProductResult;
        searchProductResultElem.classList.add("active");
        fetchProductsData();
        searchProductInput.value = "";
    }
    scrollToTop();
}

function handleProductSearchInput(Event) {
    if (Event.key === "Enter") {
        handleProductSearchConfirm();
        searchProductInput.blur();
    }

}

function clearProductSearchResult() {
    searchProductResult = null;
    fetchProductsData();
    searchProductInput.value = "";
    searchProductResultElem.classList.remove("active");
    scrollToTop();
}
///////////////////////////////// manage users section 

const usersListElem = document.querySelector(".usersList");
const deleteModalElem = document.querySelector(".deleteModal");
const cancelDeleteModalElem = document.querySelector(".cancelDeleteModal");
const confirmDeleteModalElem = document.querySelector(".confirmDeleteModal");
const deleteModalDivElem = document.querySelector(".deleteModalDiv");
const searchConfirmBtn = document.querySelector(".searchConfirm");
const searchInput = document.querySelector(".searchInput");
const searchResultElem = document.querySelector(".searchResult");
const searchResultSpanElem = document.querySelector(".searchResultSpan");

let searchResult = null;

deleteModalElem.addEventListener("click", hideDeleteModal);
cancelDeleteModalElem.addEventListener("click", hideDeleteModal);
confirmDeleteModalElem.addEventListener("click", deleteUser);
deleteModalDivElem.addEventListener("click", preventClick);
searchConfirmBtn.addEventListener("click", handleSearchConfirm);
searchInput.addEventListener("keyup", handleSearchInput);
searchResultElem.addEventListener("click", clearSearchResult);

function fetchUsersData() {
    let link = `http://localhost:3000/users`;
    if (searchResult) {
        link += `?userName=${searchResult}`;
    }
    fetch(link)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("خطا در برقرای ارتباط با سرور.");
            }
        })
        .then(data => {
            if (data.length) {

                generateUserList(data);
            } else {
                generateNoResultItem(usersListElem);
            }
        })
        .catch(err => showModal(err.message));
}

function generateUserList(data) {
    removeAllChild(usersListElem);
    let newListFragment = document.createDocumentFragment();

    data.forEach(user => {
        let newUserItem = document.createElement("div");
        newUserItem.dataset.id = user.id;
        newUserItem.dataset.temp = user.tempCode;
        newUserItem.classList.add("userItem");

        // name input
        let newItemDivName = createDiv("itemDiv");
        let newNameLabel = createLabel("نام");
        let newNameInput = createInput("nameInput", user.firstName, "نام کاربر را وارد کنید.", "text");
        newItemDivName.append(newNameLabel, newNameInput);

        // last name input
        let newItemDivLastName = createDiv("itemDiv");
        let newLastNameLabel = createLabel("نام خانوادگی");
        let newLastNameInput = createInput("lastNameInput", user.lastName, "نام خانوادگی کاربر را وارد کنید.", "text");
        newItemDivLastName.append(newLastNameLabel, newLastNameInput);

        // email input
        let newItemDivEmail = createDiv("itemDiv");
        let newEmailLabel = createLabel("ایمیل");
        let newEmailInput = createInput("emailInput", user.userName, "ایمیل کاربر را وارد کنید.", "email");
        newItemDivEmail.append(newEmailLabel, newEmailInput);

        // password input
        let newItemDivPasword = createDiv("itemDiv");
        let newPaswordLabel = createLabel("کلمه عبور");
        let newPaswordInput = createInput("passwordInput", user.password, "کلمه عبور کاربر را وارد کنید.", "text");
        newItemDivPasword.append(newPaswordLabel, newPaswordInput);

        // phone input
        let newItemDivPhone = createDiv("itemDiv");
        let newPhoneLabel = createLabel("شماره تلفن");
        let newPhoneInput = createInput("phoneInput", user.phoneNumber, "شماره کاربر را وارد کنید.", "number");
        newItemDivPhone.append(newPhoneLabel, newPhoneInput);

        // address input
        let newItemDivAddress = createDiv("itemDiv");
        let newAddressLabel = createLabel("آدرس");
        let newAddressInput = createInput("AddressInput", user.address, "آدرس کاربر را وارد کنید.", "text");
        newItemDivAddress.append(newAddressLabel, newAddressInput);

        // controll btns 
        let newControllDiv = createDiv("controllDiv");
        let newEditUserBtn = createButton("editUser", "edit_note", "ویرایش کاربر");

        newEditUserBtn.addEventListener("click", () => {
            newEditDiv.style.display = "grid";
            newControllDiv.style.display = "none";
            newNameInput.classList.add("enable");
            newLastNameInput.classList.add("enable");
            newEmailInput.classList.add("enable");
            newPaswordInput.classList.add("enable");
            newPhoneInput.classList.add("enable");
            newAddressInput.classList.add("enable");
        });

        let newDeleteUserBtn = createButton("deleteUser", "delete", "حذف کاربر");
        newDeleteUserBtn.addEventListener("click", () => {

            deleteItem = newUserItem.dataset.id;
            deleteLink = "http://localhost:3000/users/";
            deleteMode = "user";
            deleteModalElem.classList.add("active");
        });
        newControllDiv.append(newEditUserBtn, newDeleteUserBtn);


        // edit div
        let newEditDiv = createDiv("editDiv");

        let newSaveUserBtn = createButton("saveUser", "ذخیره");
        newSaveUserBtn.addEventListener("click", () => {

            if (newEmailInput.value === "" ||
                newPaswordInput.value === "") {
                showModal("ایمیل و کلمه عبور نباید خالی باشد.")
            } else {

                let userInfo = {
                    userName: newEmailInput.value,
                    password: newPaswordInput.value,
                    firstName: newNameInput.value,
                    lastName: newLastNameInput.value,
                    phoneNumber: newPhoneInput.value,
                    address: newAddressInput.value,
                    tempCode: newUserItem.dataset.temp,
                    id: newUserItem.dataset.id
                };

                fetch(`http://localhost:3000/users/${newUserItem.dataset.id}`, {
                        method: "PUT",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(userInfo)
                    })
                    .then(res => {
                        if (res.status === 200) {
                            showModal("اطلاعات کاربر تغییر کرد.")
                            fetchUsersData();
                        } else {
                            throw new Error("خطایی رخ داده است دوباره تلاش کنید.")
                        }
                    })
                    .catch(err => showModal(err.message));
            }
        });

        let newCancelUserBtn = createButton("cancelUser", "لغو");

        newCancelUserBtn.addEventListener("click", () => {
            fetchUsersData();
        });



        newEditDiv.append(newSaveUserBtn, newCancelUserBtn);

        newUserItem.append(newItemDivName, newItemDivLastName, newItemDivEmail, newItemDivPasword, newItemDivPhone, newItemDivAddress, newControllDiv, newEditDiv);

        newListFragment.appendChild(newUserItem);

    });

    usersListElem.appendChild(newListFragment);

}

function generateNoResultItem(parent) {
    removeAllChild(parent);

    let newNoResult = createDiv("userItem");
    let newNoResultText = createP("noResultText", "نتیجه ای یافت نشد.");
    newNoResult.appendChild(newNoResultText);

    parent.appendChild(newNoResult);
}

function hideDeleteModal(Event) {
    Event.stopPropagation();
    deleteModalElem.classList.remove("active");
}

function deleteUser(Event) {
    Event.stopPropagation();
    fetch(deleteLink + deleteItem, {
            method: "DELETE"
        })
        .then(res => {
            if (res.status === 200) {
                deleteModalElem.classList.remove("active");
                if (deleteMode === "user") {
                    fetchUsersData();
                } else if (deleteMode === "product") {
                    fetchProductsData();
                } else if (deleteMode === "purchase") {
                    fetchPurchaseData();
                }
            } else {
                throw new Error("خطا در برقراری ارتباط  با سرور");
            }
        })
        .catch(err => showModal(err));
}

function handleSearchConfirm() {
    searchResult = searchInput.value;
    if (searchResult !== "") {
        searchResultSpanElem.innerText = searchResult;
        searchResultElem.classList.add("active");
        fetchUsersData();
        searchInput.value = "";
    }
    scrollToTop();
}

function handleSearchInput(Event) {
    if (Event.key === "Enter") {
        handleSearchConfirm();
        searchInput.blur();
    }
}

function clearSearchResult() {
    searchResult = null;
    fetchUsersData();
    searchInput.value = "";
    searchResultElem.classList.remove("active");
    scrollToTop();
}