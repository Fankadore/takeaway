import React, { useContext } from 'react';
import axios from 'axios';
import './MenuSection.scss';

import MenuItem from '../MenuItem/MenuItem';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import TextInput from '../../components/TextInput/TextInput';
import ActionButton from '../../components/ActionButton/ActionButton';
import OpenClose from '../../components/OpenClose/OpenClose';

import MenuContext from '../../context/MenuContext';

function MenuSection(props) {
	const { id, index, section, parentId, parentEditMode } = props;
	const context = useContext(MenuContext);
	const { admin, menu, editId, newId, name, description } = context;
	const { updateMenus, createPopup, addResource, editResource, cancelEdit, moveResource, moveItemToSection, handleName, handleDescription } = context;

	const editMode = (admin && (!section._id || editId === section._id));
	const newItem = (newId === section._id);

	const editSection = () => {
		editResource(section);
	};
	const saveSection = () => {
		if (!admin) return;

		if (!name) {
			createPopup("Name is required.");
			return;
		}

		if (section._id) {
			// Update Section
			axios.put('http://localhost:2000/menu/section/' + section._id, {
				name,
				description,
			})
			.then(result => updateMenus())
			.catch(err => console.log(err));
		}
		else {
			// Add Section
			axios.post('http://localhost:2000/menu/section', {
				menuId: parentId,
				name,
				description,
			})
			.then(result => updateMenus())
			.catch(err => console.log(err));
		}

		cancelEdit();
	};
	const removeSection = () => {
		
		if (section._id) {
			let confirmed = window.confirm("Are you sure you want to remove this section?\nThis will also remove all items in the section.");
			if (!confirmed) return;
			
			axios.delete('http://localhost:2000/menu/section/' + section._id)
			.then(result => updateMenus())
			.catch(err => console.log(err));
		}

		cancelEdit();
	};
	const moveSection = (startIndex, endIndex) => {
		const sections = moveResource(menu.sections, startIndex, endIndex);

		axios.put('http://localhost:2000/menu/' + parentId, {sections})
		.then(result => updateMenus())
		.catch(err => console.log(err));
	};
	const addItem = () => {
		addResource(section._id);
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
			const startIndex = e.dataTransfer.getData("index");
			const endIndex = index;
			moveSection(startIndex, endIndex);
		}
		else if (type === "item") {
			const sectionId = e.dataTransfer.getData("parentId");
			if (sectionId !== section._id) {
				const itemId = e.dataTransfer.getData("id");
				moveItemToSection(itemId, sectionId, section._id);
			}
		}
	};

	// Render
	const renderHeader = () => {
		const nameInput = (editMode) ? name : section.name;
		const descriptionInput = (editMode) ? description : section.description;

		return (
			<header className={id + "-header"}>
				<ActionButton id={id + "-edit"} action="edit" callback={editSection} hide={(!admin || editMode || parentEditMode)} />
				<TextInput id={id + "-name"} update={handleName} value={nameInput} placeholder="Name..."  edit={editMode} />
				<TextInput id={id + "-description"} update={handleDescription} value={descriptionInput} placeholder="Description..."  edit={editMode} />
				<ActionButton id={id + "-move"} action="move" callback={onDragStart} hide={!parentEditMode} />
				<ConfirmBar id={id + "-confirm"} cancel={cancelEdit} confirm={saveSection} hide={!editMode} />
			</header>
		);
	};
	const renderItems = () => {
		if (section.items) return section.items.map((item, index) => <MenuItem key={index} index={index} id={id + "__item"} item={item} parentId={section._id} parentEditMode={editMode || parentEditMode} />)
		else return null;
	};
	const renderNewItem = () => {
		if (admin && newItem) return <MenuItem id={id + "__item"} item={{}} parentId={section._id} />
		else return null;
	};
	const renderFooter = () => {
		if (!admin) return null;

		if (!parentEditMode) {
			return (
				<footer className={id + "-footer"}>
					<ActionButton id={id + "-remove"} action="remove" callback={removeSection} hide={!editMode} />
					<OpenClose id={id + "-add"} close={cancelEdit} open={addItem} isOpen={newItem} hide={editMode} />
				</footer>
			);
		}
		else return null;
	};

	return (
		<section className={id} onDragOver={onDragOver} onDrop={onDrop}>
			{renderHeader()}
			{renderItems()}
			{renderNewItem()}
			{renderFooter()}
		</section>
	);
}

export default MenuSection;
