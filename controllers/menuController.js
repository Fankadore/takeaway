const mongoose = require('mongoose');

const Menu = require('../models/Menu.js');
const MenuSection = require('../models/MenuSection.js');
const MenuItem = require('../models/MenuItem.js');

const getMenus = (req, res, next) => {
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

const addMenu = (req, res, next) => {
	const { name, description = "", sections = [] } = req.body;

	if (!name) {
		res.status(500).json({err: "Name is required."});
		return;
	}

	const menu = new Menu({
    name,
		description,
		sections,
  });

	menu.save()
	.then(result => res.status(201).json(menu))
	.catch(err => res.status(500).json(err));
};

const updateMenu = (req, res, next) => {
	Menu.updateOne({ _id: req.params.menuId }, { $set: req.body }).exec()
	.then(menu => res.status(200).json(menu))
	.catch(err => res.status(500).json(err));
};

const removeMenu = async (req, res, next) => {
	const menuId = req.params.menuId;
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
	const { menuId } = req.params;
	const { name, description = "", items = [] } = req.body;
	
	if (!name) {
		res.status(500).json({err: "Name is required."});
		return;
	}

	let menu = await Menu.findById(menuId).exec();
	if (!menu) {
		res.status(404).json({err: "No menu found with that Id."});
		return;
	}

	const menuSection = new MenuSection({
  	name,
		description,
		items,
  });

	let saveSection = await menuSection.save();
	if (!saveSection) {
		res.status(500).json({err: "Failed to save menu section."});
		return;
	}

	const sectionIds = [...menu.sections, menuSection._id];
	let menuUpdate = await Menu.updateOne({ _id: menu._id}, {sections: sectionIds});
	if (!menuUpdate) {
		res.status(500).json({err: "Failed to add section to menu."});
		return;
	}

	res.status(201).json(menuSection);
};

const updateSection = (req, res, next) => {
  MenuSection.updateOne({ _id: req.params.sectionId }, { $set: req.body }).exec()
  .then(menuSection => res.status(200).json(menuSection))
	.catch(err => res.status(500).json(err));
};

const removeSection = async (req, res, next) => {
	const { menuId, sectionId } = req.params;
	
	// Check for other instances of this section
	let menus = await Menu.find().exec();
	const sectionCount = menus.filter(menu => (menu.sections.indexOf(sectionId) > -1));
	if (sectionCount.length === 0) {
		res.status(404).json({err: "No section found with id " + sectionId});
		return;
	}
	else if (sectionCount.length === 1) {
		// Check for other instances of these items
		let section = await MenuSection.findById(sectionId);
		let sections = await MenuSection.find().exec();
		for (let i = 0; i < section.items.length; i++) {
			const itemId = section.items[i];
			const itemCount = sections.filter(section => section.items.indexOf(itemId) > -1);

			if (itemCount < 2) {
				let itemDeleted = await MenuItem.deleteOne({ _id: itemId }).exec();
				if (!itemDeleted) {
					res.status(500).json({err: "Failed to delete item " + itemId});
					return;
				}
			}
		}

		let sectionDeleted = await MenuSection.deleteOne({ _id: sectionId }).exec();
		if (!sectionDeleted) {
			res.status(500).json({err: "Failed to delete section " + sectionId});
			return;
		}
	}

	// Remove Section from Menu
	let menu = await Menu.findById(menuId).exec();
	const updatedSections = menu.sections.filter(id => ""+id !== ""+sectionId);
	let menuSaved = await Menu.updateOne({ _id: menu._id }, { sections: updatedSections }).exec();

	if (menuSaved) res.status(200).json({success: true});
	else res.status(500).json({err: "Failed to remove section from menu"});
};

const addItem = async (req, res, next) => {
	const { sectionId } = req.params;
	const { name, price = 0, description = "" } = req.body;
	
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

const updateItem = (req, res, next) => {
	MenuItem.updateOne({ _id: req.params.itemId }, { $set: req.body }).exec()
  .then(result => res.status(200).json(result))
	.catch(err => res.status(500).json(err));
};

const removeItem = async (req, res, next) => {
	const { sectionId, itemId } = req.params;
	
	let sections = await MenuSection.find().exec();
	const itemCount = sections.filter(section => (section.items.indexOf(itemId) > -1));
	if (itemCount.length === 0) {
		res.status(404).json({err: "No item found with id " + itemId});
		return;
	}
	else if (itemCount.length === 1) {
		let itemDeleted = await MenuItem.deleteOne({ _id: itemId }).exec();
		if (!itemDeleted) {
			res.status(500).json({err: "Failed to delete item " + itemId});
			return;
		}
	}
	let section = await MenuSection.findById(sectionId).exec();
	const updatedItems = section.items.filter(id => ""+id !== ""+itemId);
	let sectionSaved = await MenuSection.updateOne({ _id: sectionId }, { items: updatedItems }).exec();

	if (sectionSaved) res.status(200).json({success: true});
	else res.status(500).json({err: "Failed to remove item from section"});
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
