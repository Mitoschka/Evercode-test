// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');

const express = require('express');
const fs = require('fs');

const app = express();

// Эта строка необходима для парсинга тела запроса
app.use(express.json());

// Задаём константы как пределы значений генерации числа
const MIN = 1;
const MAX = 1000;

// Задаём функцию генерации числа
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Генерируем объект с уникальным id и сгенирированным числом
const generate = () => ({
  id: nanoid(20),
  number: getRandomInt(MIN, MAX),
});

// Сохраняем данные об идентификаторе в json-файл
const saveDataInFile = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync('database.json', stringifyData);
};

// Получаем данные о идентификаторе из json-файла
const getDataFormFile = () => {
  if (!fs.existsSync('database.json')) {
    fs.writeFileSync('database.json', '[]');
  }
  const jsonData = fs.readFileSync('database.json');
  return JSON.parse(jsonData);
};

/* Запись - POST метод */
app.post('/generate', (req, res) => {
  // Получаем сгенированный объект
  const generatedObj = generate();

  // Получаем существующие записи объектов
  const existObj = getDataFormFile();

  // Добавим данные об объекте
  existObj.push(generatedObj);

  // Сохраним новый объект
  saveDataInFile(existObj);
  res.json(existObj);
});

/* Чтение - GET метод */
app.get('/retrieve/:id', (req, res) => {
  // Получение идентификатора из url
  const targetId = req.params.id;

  // Получаем существующие записи объектов
  const existObj = getDataFormFile();

  // Проверим, существует ли такой ID
  const findExist = existObj.find((obj) => obj.id === targetId);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: 'ID not exist' });
  }

  res.json(existObj);
});

// Настраиваем порт сервера
app.listen(3000, () => {
  console.log('Server runs on port 3000');
});
