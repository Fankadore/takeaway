const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishes.js')

router.get('/', dishController.getAllDishes);
router.post('/', dishController.addDish);
router.get('/:id', dishController.getDish);
router.patch('/:id', dishController.updateDish);
router.delete('/:id', dishController.deleteDish);

module.exports = router;
