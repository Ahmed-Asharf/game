const express = require('express');
const gameController = require('../controllers/gameController');
const router = express.Router();

router.route('/').get(gameController.getAll).post(gameController.createGame);

router
  .route('/:id')
  .get(gameController.getOne)
  .patch(gameController.updateGame)
  .delete(gameController.deleteGame);

module.exports = router;
