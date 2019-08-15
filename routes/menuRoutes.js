const express = require('express');
const menuController = require('../controllers/menuController.js');

const router = express.Router();

router.get('/', menuController.getMenus);

router.post('/', menuController.addMenu);
router.delete('/:menuId', menuController.removeMenu);
router.put('/:menuId', menuController.updateMenu);

router.post('/:menuId/section', menuController.addSection);
router.delete('/:menuId/section/:sectionId', menuController.removeSection);
router.put('/section/:sectionId', menuController.updateSection);

router.post('/section/:sectionId/item', menuController.addItem);
router.delete('/section/:sectionId/item/:itemId', menuController.removeItem);
router.put('/item/:itemId', menuController.updateItem);

module.exports = router;
