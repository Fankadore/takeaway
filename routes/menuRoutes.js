const express = require('express');
const menuController = require('../controllers/menuController.js');

const router = express.Router();

router.get('/', menuController.getMenus);
router.post('/', menuController.addMenu);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.removeMenu);

router.post('/section', menuController.addSection);
router.put('/section/:id', menuController.updateSection);
router.delete('/section/:id', menuController.removeSection);

router.post('/item', menuController.addItem);
router.put('/item/:id', menuController.updateItem);
router.delete('/item/:id', menuController.removeItem);

module.exports = router;
