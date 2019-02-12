'use strict';

let sideNav = document.querySelector('.side-nav__list');
let rdmJokeBtn = document.querySelector('#rdmJokeBtn');
let jokeDesc = document.querySelector('#jokeDesc');
let showMoreBtn = document.querySelector('#showMoreBtn');

let currentCategory;
let categories;
let hiddenCategories = [];

getCategories();




rdmJokeBtn.addEventListener('click', function(evt) { // Если на Random Joke кнопку нажали
  evt.preventDefault();

  let xhr = new XMLHttpRequest(); // Создаю xmlhttp запрос
  if (!currentCategory) {
    xhr.open('GET', 'https://api.chucknorris.io/jokes/random', true);
  } else {
    let categoryText = currentCategory.querySelector('button').innerHTML;
    let urlCategory = 'https://api.chucknorris.io/jokes/random?category=' + categoryText;
    xhr.open('GET', urlCategory, true);
  }

  xhr.send();

  xhr.onreadystatechange = function() {
  if (this.readyState != 4) return;

  if (this.status != 200) { // Если запрос не удался
    alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
    return;
  }

  let randJoke = JSON.parse(this.responseText).value; // Получил строку рандомной шутки
  randJoke = '"' + randJoke + '"'; // Добавил кавычки
  jokeDesc.innerHTML = randJoke; // Записал шутку в элемент
  }
});

showMoreBtn.addEventListener('click', function(evt) { //Если на more categories кнопку нажали
  if (hiddenCategories.length === 0) { //Если нету доп. категорий
    return;
  }

  if (!showMoreBtn.classList.contains('side-nav__show-more--opened')) { //Если кнопка не раскрыла список
    hiddenCategories.forEach(function(elem) { // Перебираем массив дополнительных категорий
      elem.classList.remove('side-nav__item--hidden'); // Каждому убираем скрывающий класс
    });

    showMoreBtn.classList.add('side-nav__show-more--opened');
    showMoreBtn.innerHTML = 'close';
  } else { // Иначе все наоборот
    hiddenCategories.forEach(function(elem) {
      elem.classList.add('side-nav__item--hidden');
    });

    showMoreBtn.classList.remove('side-nav__show-more--opened');
    showMoreBtn.innerHTML = 'more';
  }
});

function getCategories() {
  let xhr = new XMLHttpRequest(); // Создаю xmlhttp запрос
  xhr.open('GET', 'https://api.chucknorris.io/jokes/categories', true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;

    if (this.status != 200) { // Если запрос не удался
      alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
      return;
    }

    categories = JSON.parse(this.responseText); // Получаем массив категорий
    fillCategories(); // Заполняем страницу категориями
  }
}

function fillCategories() {
    categories.forEach(function (elem, index) { // Перебираю все категории
    let sideNavItem = document.createElement('li'); // Создаю элемент на странице и заполняю его классами и содержимым категории
    sideNavItem.classList.add('side-nav__item');

    if (index > 9) { // Если дошли дальше 10-го элемента, скрываем из разметки и записываем в массив
      sideNavItem.classList.add('side-nav__item--hidden');
      hiddenCategories.push(sideNavItem);
    }

    let sideNavBtn = document.createElement('button');
    sideNavBtn.innerHTML = elem;

    sideNavItem.appendChild(sideNavBtn);

    sideNavBtn.addEventListener('click', sideNavBtnCallBack);

    sideNav.appendChild(sideNavItem);
  });

  function sideNavBtnCallBack(evt) { // Колбек для кнопки
    let xhr = new XMLHttpRequest(); // Создаю xmlhttp запрос
    let categoryText = evt.target.innerHTML;
    let urlCategory = 'https://api.chucknorris.io/jokes/random?category=' + categoryText;
    xhr.open('GET', urlCategory, true);
    xhr.send();

    xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;

    if (this.status != 200) { // Если запрос не удался
      alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
      return;
    }

    if (currentCategory) {
      currentCategory.classList.remove('side-nav__item--current');
    }

    evt.target.parentElement.classList.add('side-nav__item--current'); //Вешаем лишке активный класс
    currentCategory = evt.target.parentElement;

    let joke = JSON.parse(this.responseText).value; // Получаем шутку
    joke = '"' + joke + '"'; // Добавил кавычки
    jokeDesc.innerHTML = joke;
    }
 }
}
