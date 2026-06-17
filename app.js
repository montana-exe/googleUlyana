import { complimentList } from "./list.js";

const input = document.querySelector(".search__input-string");
const searchButton = document.querySelector(".search-icon");
const gptButton = document.querySelector(".gpt-icon");
const compliment = document.querySelector(".text-list");
const photoList = document.querySelector(".compliment__photo-list");
const list = document.querySelector(".list");
const profile = document.querySelector(".header__profile");
const buttonCancel = document.querySelector(".button-cancel");
const buttonSubmit = document.querySelector(".button-submit");
const tagsAdd = document.querySelector(".tags__add");
const inputAdd = document.querySelector(".tags__add-input-lable-input");
const inputName = document.querySelector(".input-name");
const inputUrl = document.querySelector(".input-url");
const tagsAddTitle = document.querySelector(".tags__add-title");

let search = true;
let editIndex = null;
let listTag = JSON.parse(localStorage.getItem("tags")) || [
  { name: "Добавить ярлык", url: "https://www.twitch.tv" },
];

compliment.textContent = complimentList();
photoList.src = `photo/${Math.floor(Math.random() * 121)}.avif`;

createTags();

searchButton.addEventListener("click", () => {
  const query = input.value.trim();
  let searchHref = "";

  if (query === "") return;

  if (search) {
    searchHref = "www.google.com/search?q=";
  } else {
    searchHref = "ya.ru/search?text=";
  }

  window.location.href = `https://${searchHref}${encodeURIComponent(query)}`;
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

gptButton.addEventListener("click", () => {
  const text = input.value.trim();

  if (text === "") return;

  window.location.href = `https://chatgpt.com/?prompt=${encodeURIComponent(text)}`;
});

function createTags() {
  let forTag = listTag.map((t) => t.name);
  let forTagUrl = listTag.map((t) => t.url);
  for (let i = 0; i < forTag.length; i++) {
    const li = document.createElement("li");
    const pointTag = document.createElement("div");
    const logoTag = document.createElement("div");
    const menuTag = document.createElement("div");
    const buttonEdit = document.createElement("button");
    const buttonDelete = document.createElement("button");
    const pointTagImg = document.createElement("img");
    const logoTagImg = document.createElement("img");
    const nameTag = document.createElement("p");
    li.classList.add("li__tags");
    logoTag.classList.add("logoTag");
    logoTagImg.classList.add("logoTagImg");
    nameTag.classList.add("nameTag");
    pointTag.classList.add("buttonPoint");
    pointTagImg.classList.add("buttonPointImg");
    menuTag.classList.add("tag__menu");
    buttonEdit.classList.add("tag__menu-button");
    buttonDelete.classList.add("tag__menu-button");
    buttonEdit.classList.add("button-edit");
    buttonDelete.classList.add("button-delete");
    nameTag.textContent = forTag[i];
    if (forTag[i] === "Добавить ярлык") {
      logoTagImg.src = "icon/plus.png";
    } else {
      logoTagImg.src = `${forTagUrl[i]}/favicon.ico`;
      pointTagImg.src = "icon/point.png";
      pointTag.append(pointTagImg);
      li.append(pointTag);
      buttonEdit.textContent = "Изменить ярлык";
      buttonDelete.textContent = "Удалить";
      menuTag.append(buttonEdit);
      menuTag.append(buttonDelete);
    }
    logoTag.append(logoTagImg);
    li.append(logoTag);
    li.append(nameTag);
    li.append(menuTag);
    list.append(li);
  }
}

list.addEventListener("click", (e) => {
  const tag = e.target.closest(".li__tags");

  if (!tag) return;

  const index = [...list.children].indexOf(e.target.closest(".li__tags"));
  if (e.target.closest(".buttonPoint")) {
    const menuBtn = e.target.closest(".buttonPoint");
    if (!menuBtn) return;

    const tag = menuBtn.closest(".li__tags");
    const menu = tag.querySelector(".tag__menu");

    menu.classList.toggle("active");
    return;
  }

  if (e.target.closest(".button-edit")) {
    const edit = e.target.closest(".button-edit");
    if (!edit) return;
    editIndex = index;
    inputName.value = listTag[index].name;
    inputUrl.value = listTag[index].url;
    tagsAddTitle.textContent = "Изменить ярлык";
    tagsAdd.classList.remove("hidden");
    return;
  }

  if (e.target.closest(".button-delete")) {
    const Eldelete = e.target.closest(".button-delete");
    if (!Eldelete) return;
    if (index !== -1) {
      listTag.splice(index, 1);
    }
    saveJSON()
    return;
  }

  if (tag.children[1].textContent === "Добавить ярлык") {
    tagsAddTitle.textContent = "Добавить ярлык";
    tagsAdd.classList.remove("hidden");
  } else {
    window.location.href = listTag[index].url;
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".li__tags")) {
    document
      .querySelectorAll(".tag__menu.active")
      .forEach((menu) => menu.classList.remove("active"));
  }
});

buttonCancel.addEventListener("click", () => {
  tagsAdd.classList.add("hidden");
});

inputAdd.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    buttonSubmit.click();
  }
});

buttonSubmit.addEventListener("click", () => {
  if (
    inputName.value.trim() &&
    inputUrl.value.trim() &&
    inputName.value !== "Добавить ярлык"
  ) {
    checkUrl(inputUrl.value)
    if (tagsAddTitle.textContent === "Изменить ярлык") {
      listTag[editIndex].name = inputName.value;
      listTag[editIndex].url = inputUrl.value;
    } else {
      listTag.unshift({ name: inputName.value, url: inputUrl.value });
    }
    buttonSubmitSave();
  }
});

inputAdd.addEventListener("input", () => {
  if (inputAdd.value.trim() !== "") {
    buttonSubmit.classList.add("button__validate");
  } else {
    buttonSubmit.classList.remove("button__validate");
  }
});

function buttonSubmitSave() {
  inputName.value = "";
  inputUrl.value = "";
  tagsAdd.classList.add("hidden");
  saveJSON();
}

function checkUrl(url){
  if(url.at(-1) === '/'){
    return inputUrl.value = url.slice(0,-1)
  }else
    return inputUrl.value = url
}

function saveJSON() {
  localStorage.setItem("tags", JSON.stringify(listTag));
  list.replaceChildren();
  createTags();
}