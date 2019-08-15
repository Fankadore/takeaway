import React, { useState } from 'react';
import axios from 'axios';
import './MenuSection.scss';

import { moveElement } from '../../utils';

import MenuItem from './MenuItem';
import AddMenuItem from './AddMenuItem';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import TextInput from '../../components/TextInput/TextInput';
import ActionButton from '../../components/ActionButton/ActionButton';
import OpenClose from '../../components/OpenClose/OpenClose';

const MenuSection = ({ admin, index, menu, setMenu, section, parentEdit, setPopup }) => {
	const [edit, setEdit] = useState(false);
	const [addItem, setAddItem] = useState(false);
	const [editName, setEditName] = useState(section.name);
	const [editDescription, setEditDescription] = useState(section.description);

	const saveSection = () => {
		if (!editName) {
			setPopup("Name is required.");
			return;
		}

		const updatedSection = {...section, name: editName, description: editDescription};
		const updatedSections = menu.sections.map(sect => {
			if (sect._id === section._id) return updatedSection;
			else return sect;
		});
		
		setMenu({...menu, sections: updatedSections});
		setEdit(false);

		axios.put(`http://localhost:2000/menu/section/${section._id}`, updatedSection)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};
	const removeSection = () => {
		let confirmed = window.confirm("Are you sure you want to remove this section?\nThis will also remove all items in the section.");
		if (!confirmed) return;

		axios.delete(`http://localhost:2000/menu/${menu._id}/section/${section._id}`)
		.then(response => {
			const sections = menu.sections.map(sect => {
				if (sect._id !== section._id) return sect;
				else return null;
			})
			.filter(sect => sect != null);
	
			setMenu({...menu, sections});
			setEdit(false);
		})
		.catch(err => console.log(err));
	};

	const moveSection = (startIndex, endIndex) => {
		const updatedSections = moveElement(menu.sections, startIndex, endIndex);
		const updatedMenu = {...menu, sections: updatedSections};
		setMenu(updatedMenu);

		axios.put(`http://localhost:2000/menu/${menu._id}`, updatedMenu)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};
	const moveItemToSection = (itemId, oldSectionId, newSectionId) => {
		const oldSection = menu.sections.find(section => section._id === oldSectionId);
		const newSection = menu.sections.find(section => section._id === newSectionId);
		
		const item = oldSection.items.find(item => item._id === itemId);
		const oldItems = oldSection.items.filter(item => item._id !== itemId);
		const newItems = (newSection.items) ? [...newSection.items, item] : [item];
	
		const updatedSections = menu.sections.map(sect => {
			if (sect._id === oldSectionId) sect.items = oldItems;
			else if (sect._id === newSectionId) sect.items = newItems;
			return sect;
		});
		
		setMenu({...menu, sections: updatedSections});
		
		axios.put(`http://localhost:2000/menu/section/${oldSectionId}`, {...oldSection, items: oldItems})
		.then(response => {
			axios.put(`http://localhost:2000/menu/section/${newSectionId}`, {...newSection, items: newItems})
			.then(response => console.log(response))
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
	};

	const onDragStart = (e) => {
		const parent = e.target.parentNode;
		e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("type", "section");
    e.dataTransfer.setData("html", parent);
		e.dataTransfer.setDragImage(parent, 0, 0);
	};
	const onDragOver = (e) => {
		e.preventDefault();
	};
	const onDrop = (e) => {
		e.preventDefault();
		e.target.classList.remove("drag-over");
		const type = e.dataTransfer.getData("type");
		
		if (type === "section") {
			moveSection(e.dataTransfer.getData("index"), index);
		}
		else if (type === "item") {
			const sectionId = e.dataTransfer.getData("parentId");
			if (sectionId !== section._id) {
				const itemId = e.dataTransfer.getData("id");
				moveItemToSection(itemId, sectionId, section._id);
			}
		}
	};

	const renderHeader = () => {
		const nameInput = (edit) ? editName : section.name;
		const descriptionInput = (edit) ? editDescription : section.description;

		return (
			<header className="menu__section-header">
				<ActionButton
					id="menu__section-edit"
					action="edit"
					callback={() => setEdit(true)}
					hide={(!admin || edit || parentEdit)}
				/>
				<TextInput
					id="menu__section-name"
					update={(e) => setEditName(e.target.value)}
					value={nameInput}
					placeholder="Name..."
					edit={edit}
				/>
				<TextInput
					id="menu__section-description"
					update={(e) => setEditDescription(e.target.value)}
					value={descriptionInput}
					placeholder="Description..."
					edit={edit}
				/>
				<ActionButton
					id="menu__section-move"
					action="move"
					callback={onDragStart}
					hide={!parentEdit}
				/>
				<ConfirmBar
					id="menu__section-confirm"
					cancel={() => setEdit(false)}
					confirm={saveSection}
					hide={!edit}
				/>
			</header>
		);
	};
	const renderItems = () => {
		if (!section.items) return null;

		return section.items.map((item, index) => {
			return (
				item &&
				<MenuItem
					key={item._id}
					admin={admin}
					index={index}
					menu={menu}
					setMenu={setMenu}
					section={section}
					item={item}
					parentEdit={edit || parentEdit}
					setPopup={setPopup}
					moveItemToSection={moveItemToSection}
				/>
			);
		});
	};
	const renderNewItem = () => {
		if (!admin || !addItem) return null;

		return (
			<AddMenuItem
				menu={menu}
				section={section}
				setMenu={setMenu}
				setAddItem={setAddItem}
				setPopup={setPopup}
			/>
		);
	};
	const renderFooter = () => {
		if (!admin || parentEdit) return null;

		return (
			<footer className="menu__section-footer">
				<ActionButton
					id="menu__section-remove"
					action="remove"
					callback={removeSection}
					hide={!edit}
				/>
				<OpenClose
					id="menu__section-add"
					close={() => setAddItem(false)}
					open={() => setAddItem(true)}
					isOpen={addItem}
					hide={edit}
				/>
			</footer>
		);
	};

	return (
		<section className="menu__section" onDragOver={onDragOver} onDrop={onDrop}>
			{renderHeader()}
			{renderItems()}
			{renderNewItem()}
			{renderFooter()}
		</section>
	);
};

export default MenuSection;
