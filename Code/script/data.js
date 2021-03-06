let todos = [{
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
    },
    {
        "userId": 1,
        "id": 2,
        "title": "quis ut nam facilis et officia qui",
        "completed": false
    },
    {
        "userId": 1,
        "id": 3,
        "title": "fugiat veniam minus",
        "completed": false
    },
    {
        "userId": 1,
        "id": 4,
        "title": "et porro tempora",
        "completed": true
    },
    {
        "userId": 1,
        "id": 5,
        "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
        "completed": false
    },
    {
        "userId": 1,
        "id": 6,
        "title": "qui ullam ratione quibusdam voluptatem quia omnis",
        "completed": false
    },
    {
        "userId": 1,
        "id": 7,
        "title": "illo expedita consequatur quia in",
        "completed": false
    },
    {
        "userId": 1,
        "id": 8,
        "title": "quo adipisci enim quam ut ab",
        "completed": true
    },
    {
        "userId": 1,
        "id": 9,
        "title": "molestiae perspiciatis ipsa",
        "completed": false
    },
    {
        "userId": 1,
        "id": 10,
        "title": "illo est ratione doloremque quia maiores aut",
        "completed": true
    },
    {
        "userId": 1,
        "id": 11,
        "title": "vero rerum temporibus dolor",
        "completed": true
    },
    {
        "userId": 1,
        "id": 12,
        "title": "ipsa repellendus fugit nisi",
        "completed": true
    },
    {
        "userId": 1,
        "id": 13,
        "title": "et doloremque nulla",
        "completed": false
    },
    {
        "userId": 1,
        "id": 14,
        "title": "repellendus sunt dolores architecto voluptatum",
        "completed": true
    },
    {
        "userId": 1,
        "id": 15,
        "title": "ab voluptatum amet voluptas",
        "completed": true
    },
    {
        "userId": 1,
        "id": 16,
        "title": "accusamus eos facilis sint et aut voluptatem",
        "completed": true
    },
    {
        "userId": 1,
        "id": 17,
        "title": "quo laboriosam deleniti aut qui",
        "completed": true
    },
    {
        "userId": 1,
        "id": 18,
        "title": "dolorum est consequatur ea mollitia in culpa",
        "completed": false
    },
    {
        "userId": 1,
        "id": 19,
        "title": "molestiae ipsa aut voluptatibus pariatur dolor nihil",
        "completed": true
    },
    {
        "userId": 1,
        "id": 20,
        "title": "ullam nobis libero sapiente ad optio sint",
        "completed": true
    },
    {
        "userId": 2,
        "id": 21,
        "title": "suscipit repellat esse quibusdam voluptatem incidunt",
        "completed": false
    }
];
let users = [
    { id: 1, userName: "Amirhossein", age: 30 },
    { id: 2, userName: "Karen", age: 22 },
    { id: 3, userName: "Mahya", age: 28 },
    { id: 4, userName: "Behrad", age: 18 },
    { id: 5, userName: "Madiyar", age: 32 },
    { id: 6, userName: "Kave", age: 24 },
    { id: 7, userName: "Dina", age: 23 },
]
let products = [
    { id: 0, name: "????????", price: 125000, img: "Assets/cover1.jpg" },
    { id: 1, name: "????????????", price: 225000, img: "Assets/cover1.jpg" },
    { id: 2, name: "??????", price: 70000, img: "Assets/cover1.jpg" },
    { id: 3, name: "??????????????", price: 45000, img: "Assets/cover1.jpg" },
    { id: 4, name: "????????????", price: 240000, img: "Assets/cover1.jpg" },
    { id: 5, name: "???????? ??????????????", price: 2500000, img: "Assets/cover1.jpg" },
    { id: 6, name: "??????????", price: 30000, img: "Assets/cover1.jpg" },
    { id: 7, name: "????????", price: 60000, img: "Assets/cover1.jpg" },
    { id: 8, name: "????", price: 45000, img: "Assets/cover1.jpg" },
    { id: 9, name: "????????????", price: 20000, img: "Assets/cover1.jpg" },
    { id: 10, name: "???? ???? ????", price: 4000000, img: "Assets/cover1.jpg" },
    { id: 11, name: "????????", price: 124000, img: "Assets/cover1.jpg" },
    { id: 12, name: "????????", price: 80000, img: "Assets/cover1.jpg" },
    { id: 13, name: "????????", price: 60000, img: "Assets/cover1.jpg" },
    { id: 14, name: "??????", price: 400000, img: "Assets/cover1.jpg" },
    { id: 15, name: "??????", price: 1000000, img: "Assets/cover1.jpg" },
    { id: 16, name: "???? ??????????", price: 23000, img: "Assets/cover1.jpg" },
    { id: 17, name: "???? ??????????", price: 5000000, img: "Assets/cover1.jpg" },
    { id: 18, name: "??????????", price: 370000, img: "Assets/cover1.jpg" },
    { id: 19, name: "??????????", price: 425000, img: "Assets/cover1.jpg" },
    { id: 20, name: "??????????", price: 310000, img: "Assets/cover1.jpg" },
]

function getData(link) {
    if (link === "todos") {
        return todos;
    } else if (link === "users") {
        return users;
    }
}

function filterProducts(str) {
    if (str === "") return [];
    let searchResult = products.filter(product => product.name.includes(str));
    return searchResult;
}
export { getData, filterProducts };