import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.scss';

import MenuSection from './MenuSection';
import AddMenuSection from './AddMenuSection';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import ActionButton from '../../components/ActionButton/ActionButton';
import OpenClose from '../../components/OpenClose/OpenClose';
import TextInput from '../../components/TextInput/TextInput';

const Menu = ({ admin, menu, previousMenu, nextMenu, setMenu, setPopup }) => {
	const [edit, setEdit] = useState(false);
	const [addSection, setAddSection] = useState(false);
	const [editName, setEditName] = useState(menu.name);
	const [editDescription, setEditDescription] = useState(menu.description);

	useEffect(() => {
		setEditName(menu.name);
		setEditDescription(menu.description);
	}, [edit]);

	const saveMenu = () => {
		if (!editName) {
			setPopup("Name is required.");
			return;
		}

		const updatedMenu = {...menu, name: editName, description: editDescription};
		setMenu(updatedMenu);
		setEdit(false);

		axios.put('http://localhost:2000/menu/' + menu._id, updatedMenu)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};
	const removeMenu = () => {
		let confirmed = window.confirm("Are you sure you want to remove this menu?\nThis will also remove all sections and items in the menu.");
		if (!confirmed) return;

		setMenu(null);
		setEdit(false);

		axios.delete('http://localhost:2000/menu/' + menu._id)
		.then(response => console.log(response))
		.catch(err => console.log(err));
	};

	const renderHeader = () => {
		const displayName = (edit) ? editName : menu.name;
		const displayDescription = (edit) ? editDescription : menu.description;

		return (
			<header className="menu__header">
				<ActionButton
					id="menu__edit"
					action="edit"
					callback={() => setEdit(true)}
					hide={(!admin || edit)}
				/>
				<TextInput
					id="menu__name"
					update={(e) => setEditName(e.target.value)}
					value={displayName}
					placeholder="Name..."
					edit={edit}
				/>
				<TextInput
					id="menu__description"
					update={(e) => setEditDescription(e.target.value)}
					value={displayDescription}
					placeholder="Description..."
					edit={edit}
				/>
				<ConfirmBar
					id="menu__confirm"
					cancel={() => setEdit(false)}
					confirm={saveMenu}
					hide={!edit}
				/>
			</header>
		);
	};
	const renderSections = () => {
		if (!menu.sections || menu.sections.length === 0) return null;
		
		return menu.sections.map((section, index) => {
			return (
				section &&
				<MenuSection
					key={section._id}
					admin={admin}
					index={index}
					menu={menu}
					setMenu={setMenu}
					section={section}
					parentId={menu._id}
					parentEdit={edit}
					setPopup={setPopup}
				/>
			);
		});
	};
	const renderNewSection = () => {
		if (!admin || !addSection) return null;
		
		return (
			<AddMenuSection
				menu={menu}
				setMenu={setMenu}
				setAddSection={setAddSection}
				setPopup={setPopup}
			/>
		);
	};
	const renderFooter = () => {
		if (!admin) return null;

		return (
			<footer className="menu__footer">
				<ActionButton
					id="menu__remove"
					action="remove"
					callback={removeMenu}
					hide={!edit}
				/>
				<OpenClose
					id="menu__add"
					close={() => setAddSection(false)}
					open={() => setAddSection(true)}
					isOpen={addSection}
					hide={edit}
				/>
			</footer>
		);
	};
	
	return (
		<main id="menu" className="menu">
			{renderHeader()}
			{renderSections()}
			{renderNewSection()}
			{renderFooter()}
		</main>
	);
};

export default Menu;
