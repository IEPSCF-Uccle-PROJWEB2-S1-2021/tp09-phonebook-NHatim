const express = require('express');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');

const router = new express.Router();

class Book {
  constructor(author, title, year) {
    this.author = author;
    this.title = title;
    this.year = year;
  }
}

const books = [
  new Book('Martin Fowler', 'UML Distilled', 1997),
  new Book('Martin Fowler and Kent Beck', 'Refactoring', 1999),
  new Book('Joshua Bloch', 'Effective Java', 2017),
  new Book('Robert C. Martin', 'Clean Code', 2009),
];

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('bookList', { title: 'Book list', books });
});

router.get('/new', (req, res, next) => {
  res.render('bookForm', { title: 'New Book' });
});

router.post(
  '/new',
  [
    body('author').trim().isLength({ min: 3 }).escape(),
    body('title').trim().isLength({ min: 3 }).escape(),
    body('year').isInt({ min: 0, max: 2100 }).toInt(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400));
    } else {
      const book = new Book(req.body.author, req.body.title, req.body.year);
      books.push(book);
      res.redirect('/books');
    }
  }
);

module.exports = router;
