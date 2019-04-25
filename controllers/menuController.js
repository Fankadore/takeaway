const mongoose = require('mongoose');
const Menu = require('../models/Menu.js');
const MenuSection = require('../models/MenuSection.js');
const MenuItem = require('../models/MenuItem.js');

const getMenus = async (req, res, next) => {
	Menu.find()
	.populate({
		path: 'sections',
		populate: {
			path: 'items',
		},
	})
	.exec()
	.then(menus => res.status(200).json(menus))
	.catch(err => res.status(500).json(err));
};

const addMenu = async (req, res, next) => {
	const { name, description = "", sections = [] } = req.body;

	if (!name) {
		res.status(500).json({err: "Name is required."});
		return;
	}

	const menu = new Menu({
		_id: new mongoose.Types.ObjectId,
    name,
		description,
		sections,
  });

	menu.save()
	.then(result => res.status(201).json(menu))
	.catch(err => res.status(500).json(err));
};

const updateMenu = async (req, res, next) => {
  Menu.updateOne({ _id: req.params.id }, { $set: req.body }).exec()
  .then(menu => res.status(200).json(menu))
	.catch(err => res.status(500).json(err));
};

const removeMenu = async (req, res, next) => {
	const menuId = req.params.id;
	let menu = await Menu.findById(menuId).exec();
	let sectionIds = menu.sections;
	let sections = await MenuSection.find({_id: {$in: sectionIds}}).exec();

	for (let section of sections) {
		const itemIds = section.items;
		let deleteItems = await MenuItem.deleteMany({_id: {$in: itemIds}}).exec();
		if (!deleteItems) {
			res.status(500).json({err: "Failed to remove all menu items."});
			return;
		}
	}

	let deleteSections = await MenuSection.deleteMany({_id: {$in: sectionIds}}).exec();
	if (!deleteSections) {
		res.status(500).json({err: "Failed to remove all menu sections."});
		return;
	}

	let deleteMenu = await Menu.deleteOne({ _id: menuId }).exec()
	if (!deleteMenu) {
		res.status(500).json({err: "Failed to remove menu."});
		return;
	}

	res.status(200).json({});
};

const addSection = async (req, res, next) => {
	const { name, description = "", items = [], menuId } = req.body;

	let menu = await Menu.findById(menuId).exec();
	if (!menu) {
		res.status(404).json({err: "No menu found with that Id."});
		return;
	}

	if (!name) {
		res.status(500).json({err: "Name is required."});
		return;
	}

	const menuSection = new MenuSection({
		_id: new mongoose.Types.ObjectId,
    name,
		description,
		items,
  });

	let result = await menuSection.save();
	if (!result) {
		res.status(500).json({err: "Failed to save menu section."});
		return;
	}

	const sectionIds = menu.sections.map(section => section._id);
	sectionIds.push(menuSection._id);
	let menuUpdate = await menu.updateOne({sections: sectionIds});
	if (!menuUpdate) {
		res.status(500).json({err: "Failed to add section to menu."});
		return;
	}

	res.status(201).json(menuSection);
};

const updateSection = async (req, res, next) => {
  MenuSection.updateOne({ _id: req.params.id }, { $set: req.body }).exec()
  .then(menuSection => res.status(200).json(menuSection))
	.catch(err => res.status(500).json(err));
};

const removeSection = async (req, res, next) => {
	const sectionId = req.params.id;
	let section = await MenuSection.findById(sectionId).exec();
	const itemIds = section.items;

	if (itemIds && itemIds.length > 0) {
		let success = MenuItem.deleteMany({_id: {$in: itemIds}}).exec();
		if (!success) {
			res.status(500).json({err: "Failed to remove all menu items."});
			return;
		}
	}

	let deleteSection = await MenuSection.deleteOne({ _id: sectionId }).exec()
	if (!deleteSection) {
		res.status(500).json({err: "Failed to remove menu section."});
		return;
	}

	res.status(200).json({success: true});
};

const addItem = async (req, res, next) => {
	const { name, price = 0, description = "", sectionId } = req.body;
	
	let section = await MenuSection.findById(sectionId).exec();
	if (!section) {
		res.status(404).json({err: "No menu section found with that Id."});
		return;
	}

	if (!name) {
		res.status(500).json({err: "Name is required."});
		return;
	}

	const menuItem = new MenuItem({
		_id: new mongoose.Types.ObjectId,
    name,
    price,
		description,
  });

	let result = await menuItem.save();
	if (!result) {
		res.status(500).json({err: "Failed to save menu item."});
		return;
	}

	const itemIds = section.items.map(item => item._id);
	itemIds.push(menuItem._id);
	let sectionUpdate = await section.updateOne({items: itemIds});
	if (!sectionUpdate) {
		res.status(500).json({err: "Failed to add item to menu section."});
		return;
	}

	res.status(201).json(menuItem);
};

const updateItem = async (req, res, next) => {
	return MenuItem.updateOne({ _id: req.params.id }, { $set: req.body }).exec()
  .then(result => res.status(200).json(result))
	.catch(err => res.status(500).json(err));
};

const removeItem = async (req, res, next) => {
	const { id } = req.params;
	
	let menuItem = await MenuItem.findById(id).exec();
	if (!menuItem) {
		res.status(404).json({err: "No menu item found with that Id"});
		return;
	}

	let sections = await MenuSection.find({items: id}).exec();
	if (sections.length > 0) {
		sections.forEach(section => {
			const itemList = section.items.map(item => item._id);
			const newItemList = itemList.filter(itemId => itemId !== id);
			section.updateOne({items: newItemList});
		});
	}

	let result = await MenuItem.deleteOne({_id: id}).exec();
	if (result) res.status(200).json({});
	else res.status(500).json({err: "Failed to remove menu item."});
};

module.exports = {
	getMenus,
	addMenu,
	updateMenu,
	removeMenu,
	addSection,
	updateSection,
	removeSection,
	addItem,
	updateItem,
	removeItem,
};
