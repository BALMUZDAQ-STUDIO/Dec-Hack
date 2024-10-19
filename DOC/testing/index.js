// Импорт библиотеки (если через npm)
const Fuse = require('fuse.js');

// Данные для поиска
const books = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "To Kill a Mockingbird", author: "Harper Lee" },
  { title: "1984", author: "George Orwell" },
  { title: "Pride and Prejudice", author: "Jane Austen" }
];

// Настройки поиска
const options = {
  includeScore: true,
  // Ищем по этим ключам объектов
  keys: ['title', 'author']
};

// Создаем экземпляр Fuse
const fuse = new Fuse(books, options);

// Ищем по ключевым словам
const searchTerm = "e";
const result = fuse.search(searchTerm);

// Выводим результат
console.log(result);