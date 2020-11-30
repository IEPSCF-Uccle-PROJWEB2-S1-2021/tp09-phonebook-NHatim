const express = require('express');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');
const { options } = require('../app');

class Phone {
  constructor(lastName, firstName, birthDate, phone, email) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthDate = birthDate;
    this.phone = phone;
    this.emailAdress = email;
  }
}

const phones = [
  new Phone('Naimi', 'Hatim', '2020-01-13', '+32488300200', 'hat@mymail.com'),
];

const router = new express.Router();

function requireAcceptsJson(req, res, next) {
  if (req.accepts('json')) {
    next();
  } else {
    next(createError(406));
  }
}

// Only responds to client accepting JSON
router.all('*', requireAcceptsJson);

router.get('/', (req, res, next) => {
  res. json({ phones });
});
router.post(
  '/',
  [
    body('lastName').trim().isLength({ min: 3 }).escape(),
    body('firstName').trim().isLength({ min: 3 }).escape(),
    body('birthDate').isAfter('1900-01-01'),
    body('phone').trim().matches(/^[+]{1}[0-9]{8,11}$/),
    body('emailAdress').normalizeEmail(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400));
    } else {
      const date = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
      const phone = new Phone(req.body.lastName, req.body.firstName, date, req.body.phone.trim(), req.body.emailAdress);
      phones.push(phone);
      res.status(201);
      res.send("Created");
      console.log(phone)
    }
  }
);

module.exports = router;
