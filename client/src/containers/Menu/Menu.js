import React, { useContext, useEffect } from 'react';
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

import { menuContext } from '../../context/MenuContext';

const Menu = (props) => {
	const { id, admin } = props;
	const {state, dispatch, menu} = useContext(menuContext);
	const { menus, selectedMenu, editId, newId, popup, name, description } = state;

	useEffect(() => dispatch({ type: "UPDATE_MENUS" }), []);
	
	const createPopup = (message) => {
		if (popup === "") setTimeout(() => dispatch({ type: "POPUP", value: "" }), 3000);
		dispatch({ type: "POPUP", value: message });
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
		return <AddMenu id={"add-" + id} />
	}
	else {
		const editMode = (admin && (!menu._id || editId === menu._id));
		const newSection = (newId === menu._id);

		const saveMenu = () => {
			if (!admin) return;
			
			if (!name) {
				createPopup("Name is required.");
				return;
			}
	
			if (menu._id) {
				axios.put('http://localhost:2000/menu/' + menu._id, {
					name,
					description,
				})
				.then(result => dispatch({ type: "UPDATE_MENUS" }))
				.catch(err => console.log(err));
			}
	
			dispatch({ type: "CANCEL_EDIT" });
		};
		const removeMenu = () => {
			let confirmed = window.confirm("Are you sure you want to remove this menu?\nThis will also remove all sections and items in the menu.");
			if (!confirmed) return;
	
			if (menu._id) {
				axios.delete('http://localhost:2000/menu/' + menu._id)
				.then(result => dispatch({ type: "UPDATE_MENUS" }))
				.catch(err => console.log(err));
			}
	
			dispatch({ type: "CANCEL_EDIT" });
		};
		const addSection = () => {
			if (admin) dispatch({ type: "ADD_RESOURCE", value: menu._id });
		};

		// Render
		const renderHeader = () => {
			const nameInput = (editMode) ? name : menu.name;
			const descriptionInput = (editMode) ? description : menu.description;
	
			return (
				<header className={id + "-header"}>
					<ActionButton
						id={id + "-edit"}
						action="edit"
						callback={() => dispatch({ type: "EDIT_RESOURCE", value: menu })}
						hide={(!admin || editMode)}
					/>
					<TextInput
						id={id + "-name"}
						update={(e) => dispatch({ type: "HANDLE_INPUT", field: "name", value: e.target.value })}
						value={nameInput}
						placeholder="Name..."
						edit={editMode}
					/>
					<TextInput
						id={id + "-description"}
						update={(e) => dispatch({ type: "HANDLE_INPUT", field: "description", value: e.target.value })}
						value={descriptionInput}
						placeholder="Description..."
						edit={editMode}
					/>
					<ConfirmBar
						id={id + "-confirm"}
						cancel={() => dispatch({ type: "CANCEL_EDIT" })}
						confirm={saveMenu}
						hide={!editMode}
					/>
				</header>
			);
		};
		const renderSections = () => {
			if (!menu.sections) return null;
			
			return menu.sections.map((section, index) => {
				if (admin || (section.items && section.items.length > 0)) {
					return (
						<MenuSection
							key={index}
							id={id + "__section"}
							index={index}
							section={section}
							parentId={menu._id}
							parentEditMode={editMode}
						/>
					);
				}
				else return null;
			}
			);
		};
		const renderNewSection = () => {
			if (admin && newSection) {
				return (
					<MenuSection
						id={id + "__section"}
						section={{}}
						parentId={menu._id}
					/>
				);
			}
			else return null;
		};
		const renderFooter = () => {
			if (!admin) return null;
	
			return (
				<footer className={id + "-footer"}>
					<ActionButton
						id={id + "-remove"}
						action="remove"
						callback={removeMenu}
						hide={!editMode}
					/>
					<OpenClose
						id={id + "-add"}
						close={dispatch({ type: "CANCEL_EDIT" })}
						open={addSection}
						isOpen={newSection}
						hide={editMode}
					/>
				</footer>
			);
		};

		return (
			<main className={id}>
				{renderHeader()}
				{renderSections()}
				{renderNewSection()}
				{renderFooter()}
				<Popup id={id + "-popup"} value={popup} />
			</main>
		);
	}
}

export default Menu;
