let modalTimeOutHandler;
const modalContainer = document.querySelector(".modalContainer");
const modalMsgElem = document.querySelector(".modalMsg");
let moveElem;
let startX, scrollLeft;
let mouseDown = false;

function removeAllChild(elem) {
    while (elem.hasChildNodes()) {
        elem.removeChild(elem.lastChild)
    }
}

function filterArrayData(arr, userSearchInput) {
    if (userSearchInput === "") {
        return null;
    }
    let filteredData = arr.filter(product => product[1].name.includes(userSearchInput));
    return filteredData;
}

function preventClick(event) {
    event.stopPropagation();
}


function showModal(msg) {
    clearTimeout(modalTimeOutHandler);

    modalContainer.classList.add("active");
    modalMsgElem.innerText = msg;

    modalTimeOutHandler = setTimeout(() => {
        modalContainer.classList.remove("active");
    }, 3000);
}

function cutLargeString(str, maxLen) {
    if (str.length > maxLen) {
        return `${str.slice(0, maxLen)}...`;
    }
    return str;
}

function startDragging(e, element) {
    mouseDown = true;
    moveElem = element;
    startX = e.pageX - moveElem.offsetLeft;
    scrollLeft = moveElem.scrollLeft;
    moveElem.style.cursor = "grabbing"
};

function stopDragging(event) {

    mouseDown = false;
    if (moveElem) {
        moveElem.style.cursor = "";
    }
};

function mouseMoveHandler(event) {
    event.preventDefault();
    if (!mouseDown) { return; }
    const x = event.pageX - moveElem.offsetLeft;
    const scroll = x - startX;
    moveElem.scrollLeft = scrollLeft - scroll;
}

function createRandomPass(max = 18) {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let rndText = "";

    for (let index = 0; index < max; index++) {
        let rndNumber = Math.floor(Math.random() * chars.length);
        let rndChar = chars[rndNumber]
        rndText += rndChar;
    }

    return rndText;
}

function checkLogged() {
    let userInfo = localStorage.userInfo;

    if (userInfo) {
        userInfo = JSON.parse(userInfo);

        fetch(`http://localhost:3000/users?userName=${userInfo.email}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return new Error("Cant access to server")
                }
            })
            .then(data => {
                if (data.length) {
                    if (data[0].tempCode === userInfo.pass) {
                        window.location = "./userProfile.html";

                    } else {

                        return new Error("Cant access to server");
                    }
                } else {

                }
            });
    }
}

function loadUserCartFormStorage() {
    let userCartHolder = localStorage.userCart;
    let userCart = {}
    if (userCartHolder) {
        userCart = JSON.parse(userCartHolder);
    }
    return userCart;
}

function createInput(className, value, placeholder, type) {
    let input = document.createElement("input");
    input.classList.add(className);
    input.value = value;
    input.placeholder = placeholder;
    input.type = type;
    return input;
}

function createTextArea(className, value, placeholder, readonly) {
    let textarea = document.createElement("textarea");
    textarea.classList.add(className);
    textarea.value = value;
    textarea.placeholder = placeholder;
    textarea.readOnly = readonly;
    return textarea;
}

function createLabel(text) {
    let label = document.createElement("label");
    label.innerText = text;
    return label;
}

function createDiv(className) {
    let div = document.createElement("div");
    div.classList.add(className);
    return div;
}

function createButton(className, text, title) {
    let button = document.createElement("button");
    button.classList.add(className);
    button.innerText = text;
    if (title) {
        button.title = title;
    }

    return button;
}

function createP(className, text) {
    let p = document.createElement("p");
    p.classList.add(className);
    p.innerText = text;
    return p;
}

function createImg(className, src, alt) {
    let img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.draggable = false;
    img.classList.add(className);
    return img;
}

function createOption(text, value) {
    let option = document.createElement("option");
    option.innerText = text;
    option.value = value;
    return option;
}

function createAnchor(className, text, link) {
    let anchor = document.createElement("a");
    anchor.classList.add(className);
    anchor.innerText = text;
    anchor.href = link;
    return anchor;
}

function createSpan(className, text) {
    let span = document.createElement("span");
    span.classList.add(className);
    span.innerText = text;
    return span;
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
export {
    removeAllChild,
    filterArrayData,
    preventClick,
    showModal,
    cutLargeString,
    startDragging,
    stopDragging,
    mouseMoveHandler,
    createRandomPass,
    checkLogged,
    loadUserCartFormStorage,
    createInput,
    createTextArea,
    createLabel,
    createDiv,
    createButton,
    createP,
    createImg,
    createOption,
    scrollToTop,
    createAnchor,
    createSpan
};