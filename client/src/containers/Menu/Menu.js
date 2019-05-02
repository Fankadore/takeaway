import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.scss';

import MenuSection from '../MenuSection/MenuSection';
import AddMenu from '../AddMenu/AddMenu';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import ActionButton from '../../components/ActionButton/ActionButton';
import OpenClose from '../../components/OpenClose/OpenClose';
import TextInput from '../../components/TextInput/TextInput';
import Spinner from '../../components/Spinner/Spinner';
import Popup from '../../components/Popup/Popup';

import MenuContext from '../../context/MenuContext';

function Menu(props) {
	const { id, admin, addToOrder } = props;

	const [menus, setMenus] = useState(null);
	const [selectedMenu, setSelectedMenu] = useState(0);
	const [editId, setEditId] = useState(null);
	const [newId, setNewId] = useState(null);
	
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);

	const [popup, setPopup] = useState("");
	
	// Fetch Data
	const updateMenus = () => {
		axios.get('http://localhost:2000/menu')
		.then(res => setMenus(res.data))
		.catch(err => console.log(err));
	};

	useEffect(updateMenus, []);

	const handleName = (e) => setName(e.target.value);
	const handleDescription = (e) => setDescription(e.target.value);
	const handlePrice = (e) => {
		let price = parseFloat(e.target.value);
		if (isNaN(price) || price < 0) price = 0;
		setPrice(price);
	};

	const editResource = (resource) => {
		if (!admin) return;
		
		const {_id = null, name = "", description = "", price = ""} = resource;

		setEditId(_id);
		setNewId(null);
		setName(name);
		setDescription(description);
		setPrice(price);
	};
	const cancelEdit = () => {
		if (!admin) return;

		setEditId(null);
		setNewId(null);
		setName("");
		setDescription("");
		setPrice(0);
	};
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
	const addResource = (resourceId) => {
		if (!admin) return;
		cancelEdit();
		setNewId(resourceId);
	};
	const createPopup = (message) => {
		if (popup === "") setTimeout(() => setPopup(""), 3000);
		setPopup(message);
	};

	// Render
	if (!menus) {
		return (
			<main className={id + " " + id + "--flex"}>
				<Spinner id={id + "-load"} />
			</main>
		);
	}
	else if (menus.length === 0) {
		return (
			<MenuContext.Provider value={{admin, name, description, popup, createPopup, updateMenus, handleName, handleDescription}}>
				<AddMenu id={id} />
			</MenuContext.Provider>
		);
	}
	else {
		const menu = menus[selectedMenu];
		const editMode = (admin && (!menu._id || editId === menu._id));
		const newSection = (newId === menu._id);

		const editMenu = () => {
			editResource(menu);
		};
		const saveMenu = () => {
			if (!admin) return;
			
			if (!name) {
				console.log("Name is required.");
				return;
			}
	
			if (menu._id) {
				axios.put('http://localhost:2000/menu/' + menu._id, {
					name,
					description,
				})
				.then(result => updateMenus())
				.catch(err => console.log(err));
			}
	
			cancelEdit();
		};
		const removeMenu = () => {
			let confirmed = window.confirm("Are you sure you want to remove this menu?\nThis will also remove all sections and items in the menu.");
			if (!confirmed) return;
	
			if (menu._id) {
				axios.delete('http://localhost:2000/menu/' + menu._id)
				.then(result => updateMenus())
				.catch(err => console.log(err));
			}
	
			cancelEdit();
		};
		const addSection = () => {
			addResource(menu._id);
		};
		const moveItemToSection = (itemId, oldSectionId, newSectionId) => {
			const oldSection = menu.sections.find(section => section._id === oldSectionId);
			const newSection = menu.sections.find(section => section._id === newSectionId);
			const item = oldSection.items.find(i => i._id === itemId);
			const oldItems = oldSection.items.filter(item => item._id !== itemId);
			const newItems = (newSection.items) ? [...newSection.items, item] : [item];

			axios.put('http://localhost:2000/menu/section/' + newSection._id, {items: newItems})
			.then(result => {
				axios.put('http://localhost:2000/menu/section/' + oldSection._id, {items: oldItems})
				.then(result => updateMenus())
				.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
		};

		// Render
		const renderHeader = () => {
			const nameInput = (editMode) ? name : menu.name;
			const descriptionInput = (editMode) ? description : menu.description;
	
			return (
				<header className={id + "-header"}>
					<ActionButton id={id + "-edit"} action="edit" callback={editMenu} hide={(!admin || editMode)} />
					<TextInput id={id + "-name"} update={handleName} value={nameInput} placeholder="Name..." edit={editMode} />
					<TextInput id={id + "-description"} update={handleDescription} value={descriptionInput} placeholder="Description..." edit={editMode} />
					<ConfirmBar id={id + "-confirm"} cancel={cancelEdit} confirm={saveMenu} hide={!editMode} />
				</header>
			);
		};
		const renderSections = () => {
			if (menu.sections) {
				return menu.sections.map((section, index) =>
					(admin || (section.items && section.items.length > 0))
						? <MenuSection key={index} id={id + "__section"} index={index} section={section} parentId={menu._id} parentEditMode={editMode} />
						: null
				);
			}
			else return null;
		};
		const renderNewSection = () => {
			if (admin && newSection) return <MenuSection id={id + "__section"} section={{}} parentId={menu._id} />
			else return null;
		};
		const renderFooter = () => {
			if (!admin) return null;
	
			return (
				<footer className={id + "-footer"}>
					<ActionButton id={id + "-remove"} action="remove" callback={removeMenu} hide={!editMode} />
					<OpenClose id={id + "-add"} close={cancelEdit} open={addSection} isOpen={newSection} hide={editMode} />
				</footer>
			);
		};

		return (
			<MenuContext.Provider value={{
				admin, menu, name, description, price, editId, newId,
				updateMenus, addToOrder, createPopup, addResource, editResource, cancelEdit, moveResource, moveItemToSection,
				handleName, handleDescription, handlePrice,
			}}>
				<main className={id}>
					{renderHeader()}
					{renderSections()}
					{renderNewSection()}
					{renderFooter()}
					<Popup id={id + "-popup"} value={popup} />
				</main>
			</MenuContext.Provider>
		);
	}
}

export default Menu;
