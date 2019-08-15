import React, { useState } from 'react';
import axios from 'axios';
import './MenuItem.scss';

import { moveElement } from '../../utils';

import ActionButton from '../../components/ActionButton/ActionButton';
import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import PriceInput from '../../components/PriceInput/PriceInput';
import TextInput from '../../components/TextInput/TextInput';

const MenuItem = ({ admin, index, menu, setMenu, section, item, parentEdit, setPopup, moveItemToSection }) => {
	const [edit, setEdit] = useState(false);
	const [editName, setEditName] = useState(item.name);
	const [editDescription, setEditDescription] = useState(item.description);
	const [editPrice, setEditPrice] = useState(item.price);

	const saveItem = () => {
		if (!editName) {
			setPopup("Name is required.");
			return;
		}

		const updatedItem = {...item, name: editName, description: editDescription, price: editPrice};
		const updatedItems = section.items.map(i => {
			if (i._id === item._id) return updatedItem;
			else return i;
		});

		const updatedSections = menu.sections.map(sect => {
			if (sect._id === section._id) return {...section, items: updatedItems};
			else return sect;
		});

		setMenu({...menu, sections: updatedSections});
		setEdit(false);
		
		axios.put(`http://localhost:2000/menu/item/${item._id}`, updatedItem)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};
	const removeItem = () => {
		let confirmed = window.confirm("Are you sure you want to remove this item?");
		if (!confirmed) return;

		const updatedItems = section.items.filter(i => (i._id !== item._id));
		const updatedSections = menu.sections.map(sect => {
			if (sect._id === section._id) return {...section, items: updatedItems};
			else return sect;
		});

		setMenu({...menu, sections: updatedSections});
		setEdit(false);

		axios.delete(`http://localhost:2000/menu/section/${section._id}/item/${item._id}`)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};

	const moveItem = (startIndex, endIndex) => {
		const updatedItems = moveElement(section.items, startIndex, endIndex);
		const updatedSection = {...section, items: updatedItems};
		const updatedSections = menu.sections.map(sect => {
			if (sect._id === section._id) return updatedSection;
			else return sect;
		});
		setMenu({...menu, sections: updatedSections});

		console.log(section);
		console.log(updatedSection);
		axios.put(`http://localhost:2000/menu/section/${section._id}`, updatedSection)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};

	const onDragStart = (e) => {
		const parent = e.target.parentNode;
		e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("index", index);
    e.dataTransfer.setData("id", item._id);
    e.dataTransfer.setData("type", "item");
    e.dataTransfer.setData("parentId", section._id);
    e.dataTransfer.setData("html", parent);
		e.dataTransfer.setDragImage(parent, 0, 0);
	};
	const onDragOver = (e) => {
		e.preventDefault();
	};
	const onDrop = (e) => {
		e.preventDefault();
		const type = e.dataTransfer.getData("type");
		const sectionId = e.dataTransfer.getData("parentId");
		const itemId = e.dataTransfer.getData("id");

		if (type === "item") {
			if (sectionId === section._id) {
				moveItem(e.dataTransfer.getData("index"), index);
			}
			else {
				moveItemToSection(itemId, sectionId, section._id);
			}
		}
	};

	const renderDetails = () => {
		const nameInput = (edit) ? editName : item.name;
		const descriptionInput = (edit) ? editDescription : item.description;
		const priceInput = (edit) ? editPrice : item.price;

		return (
			<>
				<TextInput
					id="menu__section__item-name"
					update={(e) => setEditName(e.target.value)}
					value={nameInput}
					placeholder="Name..."
					edit={edit}
				/>
				<PriceInput
					id="menu__section__item-price"
					update={(e) => setEditPrice(e.target.value)}
					value={priceInput}
					currency="£"
					edit={edit}
				/>
				<TextInput
					id="menu__section__item-description"
					update={(e) => setEditDescription(e.target.value)}
					value={descriptionInput}
					placeholder="Description..."
					edit={edit}
				/>
			</>
		);
	}
	const renderActionButton = () => {
		if (edit) {
			return (
				<ActionButton
					id="menu__section__item-remove"
					action="remove"
					callback={removeItem}
				/>
			);
		}
		else if (parentEdit) {
			return (
				<ActionButton
					id="menu__section__item-move"
					action="move"
					callback={onDragStart}
				/>
			);
		}
		else if (admin) {
			return (
				<ActionButton
					id="menu__section__item-edit"
					action="edit"
					callback={() => setEdit(true)}
				/>
			);
		}
		else {
			return (
				<ActionButton
					id="menu__section__item-add"
					action="add"
					callback={() => console.log("ADD TO ORDER")}
				/>
			);
		}
	};
	const renderConfirmBar = () => {
		return (
			<ConfirmBar
				id="menu__section__item-confirm"
				confirm={saveItem}
				cancel={() => setEdit(false)}
				hide={!edit}
			/>
		);
	};

	return (
		<section className="menu__section__item" onDragOver={onDragOver} onDrop={onDrop}>
			{renderDetails()}
			{renderActionButton()}
			{renderConfirmBar()}
		</section>
	);
}

export default MenuItem;
