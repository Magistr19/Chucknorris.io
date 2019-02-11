'use strict';

var sideNav = document.querySelector('.side-nav__list');
var rdmJokeBtn = document.querySelector('#rdmJokeBtn');
var jokeDesc = document.querySelector('#jokeDesc');
var currentCategory;
var categories;
var hiddenCategories = [];
getCategories();




rdmJokeBtn.addEventListener('click', function (evt) {
  evt.preventDefault();

  var xhr = new XMLHttpRequest(); // Создаю xmlhttp запрос
  if (!currentCategory) {
    xhr.open('GET', 'https://api.chucknorris.io/jokes/random', true);
  } else {
    var categoryText = '';//??!!
    var urlCategory = 'https://api.chucknorris.io/jokes/random?category={' + categoryText + '}';
    xhr.open('GET', urlCategory, true);
  }

  xhr.send();

  xhr.onreadystatechange = function() {
  if (this.readyState != 4) return;

  if (this.status != 200) { // Если запрос не удался
    alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
    return;
  }

  var randJoke = JSON.parse(this.responseText).value; // Получил строку рандомной шутки
  randJoke = '"' + randJoke + '"'; // Добавил кавычки
  jokeDesc.innerHTML = randJoke;
  }
});


function getCategories() {
  var xhr = new XMLHttpRequest(); // Создаю xmlhttp запрос
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
  for (var i = 0; i < categories.length; i++) {
    var sideNavItem = document.createElement('li');
    sideNavItem.classList.add('side-nav__item');

    if (i > 9) {
      sideNavItem.classList.add('side-nav__item--hidden');
      hiddenCategories.push(sideNavItem);
    }

    var sideNavBtn = document.createElement('button');
    sideNavBtn.innerHTML = categories[i];

    sideNavItem.appendChild(sideNavBtn);

    sideNavBtn.addEventListener('click', function(evt) {
      var xhr = new XMLHttpRequest(); // Создаю xmlhttp запрос
      var categoryText = sideNavBtn.innerHTML;
      var urlCategory = 'https://api.chucknorris.io/jokes/random?category=' + categoryText;
      xhr.open('GET', urlCategory, true);
      xhr.send();

      xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;

      if (this.status != 200) { // Если запрос не удался
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
      }

      sideNavItem.classList.add('side-nav__item--current');

      var joke = JSON.parse(this.responseText).value; // Получаем шутку
      joke = '"' + joke + '"'; // Добавил кавычки
      jokeDesc.innerHTML = joke;
      }
    });

    sideNav.appendChild(sideNavItem);
  }
}
