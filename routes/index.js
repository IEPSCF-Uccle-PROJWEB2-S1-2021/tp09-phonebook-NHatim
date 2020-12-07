const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
<<<<<<< HEAD
  res.render('index', { title: 'Mon répertoire' });
=======
  res.render('index', { title: 'Express' });
>>>>>>> b0a3f029e64b9843d4a19fb53f337d4f005d1638
});

module.exports = router;
