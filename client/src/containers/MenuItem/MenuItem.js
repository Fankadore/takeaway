import React, { useContext } from 'react';
import axios from 'axios';
import './MenuItem.scss';

import ActionButton from '../../components/ActionButton/ActionButton';
import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import PriceInput from '../../components/PriceInput/PriceInput';
import TextInput from '../../components/TextInput/TextInput';

import MenuContext from '../../context/MenuContext';

function MenuItem(props) {
	const { id, index, item, parentId, parentEditMode } = props;
	const context = useContext(MenuContext);
	const { admin, menu, editId, name, description, price } = context;
	const { updateMenus, createPopup, addToOrder, moveResource, editResource, cancelEdit, moveItemToSection, handleName, handleDescription, handlePrice } = context;

	const editMode = (admin && (!item._id || editId === item._id));
	
	const editItem = () => {
		editResource(item);
	};
	const saveItem = () => {
		if (!admin) return;

		if (!name) {
			createPopup("Name is required.");
			return;
		}
		
		if (item._id) {
			// Update Item
			axios.put('http://localhost:2000/menu/item/' + item._id, {
				name,
				price,
				description,
			})
			.then(result => updateMenus())
			.catch(err => console.log(err));
		}
		else {
			// Add Item
			axios.post('http://localhost:2000/menu/item', {
				sectionId: parentId,
				name,
				price,
				description,
			})
			.then(result => updateMenus())
			.catch(err => console.log(err));
		}

		cancelEdit();
	};
	const removeItem = () => {
		if (item._id) {
			let confirmed = window.confirm("Are you sure you want to remove this item?");
			if (!confirmed) return;
			
			axios.delete('http://localhost:2000/menu/item/' + item._id)
			.then(result => updateMenus())
			.catch(err => console.log(err));
		}

		cancelEdit();
	};
	const moveItem = (startIndex, endIndex) => {
		const section = menu.sections.find((element) => element._id === parentId);
		const items = moveResource(section.items, startIndex, endIndex);
		axios.put('http://localhost:2000/menu/section/' + parentId, {items})
		.then(result => updateMenus())
		.catch(err => console.log(err));
	};

	const onDragStart = (e) => {
		const parent = e.target.parentNode;
		e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("id", item._id);
    e.dataTransfer.setData("type", "item");
    e.dataTransfer.setData("parentId", parentId);
    e.dataTransfer.setData("html", parent);
		e.dataTransfer.setDragImage(parent, 0, 0);
	};
	const onDragOver = (e) => {
		e.preventDefault();
	};
	const onDrop = (e) => {
		e.preventDefault();
		const type = e.dataTransfer.getData("type");
		if (type === "item") {
			const sectionId = e.dataTransfer.getData("parentId");
			if (sectionId === parentId) {
				const startIndex = e.dataTransfer.getData("index");
				const endIndex = index;
				moveItem(startIndex, endIndex);
			}
			else {
				const itemId = e.dataTransfer.getData("id");
				moveItemToSection(itemId, sectionId, parentId);
			}
		}
	};

	// Render
	const renderActionButton = () => {
		if (editMode) return <ActionButton id={id + "-remove"} action="remove" callback={removeItem} />
		else if (parentEditMode) return <ActionButton id={id + "-move"} action="move" callback={onDragStart} />
		else if (admin) return <ActionButton id={id + "-edit"} action="edit" callback={editItem} />
		else return <ActionButton id={id + "-add"} action="add" callback={addToOrder} />
	};

	const nameInput = (editMode) ? name : item.name;
	const priceInput = (editMode) ? price : item.price;
	const descriptionInput = (editMode) ? description : item.description;

	return (
		<section className={id} onDragOver={onDragOver} onDrop={onDrop}>
			<TextInput id={id + "-name"} update={handleName} value={nameInput} placeholder="Name..."  edit={editMode} />
			<PriceInput id={id + "-price"} update={handlePrice} value={priceInput} currency="£" edit={editMode} />
			<TextInput id={id + "-description"} update={handleDescription} value={descriptionInput} placeholder="Description..." edit={editMode} />
			{renderActionButton()}
			<ConfirmBar id={id + "-confirm"} confirm={saveItem} cancel={cancelEdit} hide={!editMode} />
		</section>
	);
}

export default MenuItem;
