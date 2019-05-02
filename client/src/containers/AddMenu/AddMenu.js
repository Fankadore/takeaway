import React, { useContext } from 'react';
import axios from 'axios';
import './AddMenu.scss';

import TextInput from '../../components/TextInput/TextInput';
import Popup from '../../components/Popup/Popup';

import MenuContext from '../../context/MenuContext';

function AddMenu(props) {
	const { id } = props;

	const context = useContext(MenuContext);
	const { admin, name, description, popup } = context;
	const { updateMenus, handleName, handleDescription, createPopup } = context;

	const addMenu = () => {
		if (!name) {
			createPopup("Name is required.");
			return;
		}

		axios.post('http://localhost:2000/menu', {
			name,
			description,
		})
		.then(result => updateMenus())
		.catch(err => console.log(err));
	};

	if (admin) {
		return (
			<main id={id} className={id}>
				<TextInput id={id + "-name"} className={id + "-name"} update={handleName} value={name} placeholder="Name..." edit />
				<TextInput id={id + "-description"} className={id + "-description"} update={handleDescription} value={description} placeholder="Description..." edit />
				<span onClick={addMenu} className={id + "-icon fas fa-plus-circle"} />
				<p className={id + "-text"}>Tap to add Menu</p>
				<Popup id={id + "-popup"} className={id + "-popup"} value={popup} />
			</main>
		);
	}
	else {
		return (
			<main id={id} className={id + "--flex"}>
				<p className={id + "-not-found"}>Menu is currently unavailable, please check back soon.</p>
			</main>
		);
	}

}

export default AddMenu;
