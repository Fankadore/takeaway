import React, { useState } from 'react';
import axios from 'axios';

import TextInput from '../../components/TextInput/TextInput';

function AddMenu({ admin, setMenu, setPopup }) {
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");

	const addMenu = () => {
		if (!editName) {
			setPopup("Name is required.");
			return;
		}

		const newMenu = {name: editName, description: editDescription, sections: []};
		axios.post('http://localhost:2000/menu', newMenu)
		.then(response => {
			newMenu._id = response.data._id;
			setMenu(newMenu)
		})
		.catch(err => console.log(err));
	};

	const renderNoMenu = () => {
		return (
			<main id="menu-add" className="menu--flex">
				<p className="menu-add__not-found">Menu is currently unavailable, please check back soon.</p>
			</main>
		);
	};

	const renderAddMenu = () => {
		return (
			<main id="menu-add" className="menu-add">
				<TextInput
					id="menu-add__name"
					className="menu-add__name"
					update={(e) => setEditName(e.target.value)}
					value={editName}
					placeholder="Name..."
					edit
				/>
				<TextInput
					id="menu-add__description"
					className="menu-add__description"
					update={(e) => setEditDescription(e.target.value)}
					value={editDescription}
					placeholder="Description..."
					edit
				/>
				<span onClick={addMenu} className="menu-add__icon fas fa-plus-circle" />
				<p className="menu-add__text">Tap to add Menu</p>
			</main>
		);
	};

	return (admin) ? renderAddMenu() : renderNoMenu()
};

export default AddMenu;
