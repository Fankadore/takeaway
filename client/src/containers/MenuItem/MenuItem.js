import React, { useContext } from 'react';
import axios from 'axios';
import './MenuItem.scss';

import ActionButton from '../../components/ActionButton/ActionButton';
import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import PriceInput from '../../components/PriceInput/PriceInput';
import TextInput from '../../components/TextInput/TextInput';

import { menuContext } from '../../context/MenuContext';

const MenuItem = (props) => {
	const { id, index, item, parentId, parentEditMode } = props;
	const { state, dispatch, moveItemToSection } = useContext(menuContext);
	const { admin, menu, editId, name, description, price } = state;

	const editMode = (admin && (!item._id || editId === item._id));

	const moveResource = (array, startIndex, endIndex) => {
		startIndex = parseInt(startIndex);
		endIndex = parseInt(endIndex);
	
		if (startIndex < endIndex) {
			if (startIndex < 0 || endIndex <= 0) return;
	
			while (startIndex < endIndex) {
				const temp = array[startIndex + 1];
				array[startIndex + 1] = array[startIndex];
				array[startIndex] = temp;
				startIndex++;
			}
		}
		else if (startIndex > endIndex) {
			if (startIndex <= 0 || endIndex < 0) return;
			while (startIndex > endIndex) {
				const temp = array[startIndex - 1];
				array[startIndex - 1] = array[startIndex];
				array[startIndex] = temp;
				startIndex--;
			}
		}
	
		return array;
	};

	const saveItem = () => {
		if (!admin) return;

		if (!name) {
			dispatch({ type: "POPUP", value: "Name is required." });
			return;
		}
		
		if (item._id) {
			// Update Item
			axios.put('http://localhost:2000/menu/item/' + item._id, {
				name,
				price,
				description,
			})
			.then(result => dispatch({ type: "UPDATE_MENUS" }))
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
			.then(result => dispatch({ type: "UPDATE_MENUS" }))
			.catch(err => console.log(err));
		}

		dispatch({ type: "CANCEL_EDIT" });
	};
	const removeItem = () => {
		if (item._id) {
			let confirmed = window.confirm("Are you sure you want to remove this item?");
			if (!confirmed) return;
			
			axios.delete('http://localhost:2000/menu/item/' + item._id)
			.then(result => dispatch({ type: "UPDATE_MENUS" }))
			.catch(err => console.log(err));
		}

		dispatch({ type: "CANCEL_EDIT" });
	};
	const moveItem = (startIndex, endIndex) => {
		const section = menu.sections.find((element) => element._id === parentId);
		const items = moveResource(section.items, startIndex, endIndex);
		axios.put('http://localhost:2000/menu/section/' + parentId, {items})
		.then(result => dispatch({ type: "UPDATE_MENUS" }))
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
				moveItemToSection(menu, itemId, sectionId, parentId);
			}
		}
	};

	// Render
	const renderActionButton = () => {
		if (editMode) return <ActionButton id={id + "-remove"} action="remove" callback={removeItem} />
		else if (parentEditMode) return <ActionButton id={id + "-move"} action="move" callback={onDragStart} />
		else if (admin) return <ActionButton id={id + "-edit"} action="edit" callback={() => dispatch({ type: "EDIT_RESOURCE", value: item })} />
		else return <ActionButton id={id + "-add"} action="add" callback={() => dispatch({ type: "ADD_TO_ORDER" })} />
	};

	const nameInput = (editMode) ? name : item.name;
	const priceInput = (editMode) ? price : item.price;
	const descriptionInput = (editMode) ? description : item.description;

	return (
		<section className={id} onDragOver={onDragOver} onDrop={onDrop}>
			<TextInput
				id={id + "-name"}
				update={(e) => dispatch({ type: "HANDLE_INPUT", field: "name", value: e.target.value})}
				value={nameInput}
				placeholder="Name..."
				edit={editMode}
			/>
			<PriceInput
				id={id + "-price"}
				update={(e) => dispatch({ type: "HANDLE_PRICE", value: e.target.value })}
				value={priceInput}
				currency="£"
				edit={editMode}
			/>
			<TextInput
				id={id + "-description"}
				update={(e) => dispatch({ type: "HANDLE_INPUT", field: "description", value: e.target.value})}
				value={descriptionInput}
				placeholder="Description..."
				edit={editMode}
			/>
			{renderActionButton()}
			<ConfirmBar
				id={id + "-confirm"}
				confirm={saveItem}
				cancel={() => dispatch({ type: "CANCEL_EDIT"})}
				hide={!editMode}
			/>
		</section>
	);
}

export default MenuItem;
