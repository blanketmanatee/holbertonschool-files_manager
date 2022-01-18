const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('basic endpoint, greeting sent');
  res.send('hello world\n');
});
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
