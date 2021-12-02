const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(tourController.getAll)
  .post(
    authController.protect,
    tourController.uploadTournamentsPhoto,
    tourController.createTournament
  );
// ,
router
  .route('/:id')
  .get(tourController.getOne)
  .patch(tourController.updateTournament)
  .delete(tourController.deleteTournament);

module.exports = router;
