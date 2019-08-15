import React, { useState } from 'react';
import axios from 'axios';
import './MenuSection.scss';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import TextInput from '../../components/TextInput/TextInput';

const AddMenuSection = ({ menu, setMenu, setAddSection, setPopup }) => {
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");

	const saveSection = () => {
		if (!editName) {
			setPopup("Name is required.");
			return;
		}

		const newSection = {name: editName, description: editDescription, items: []};
		axios.post(`http://localhost:2000/menu/${menu._id}/section`, newSection)
		.then(response => {
			newSection._id = response.data._id;

			const sections = [...menu.sections, newSection];
			setMenu({...menu, sections});
			setAddSection(false);
		})
		.catch(err => console.log(err));
	};

	const renderHeader = () => {
		return (
			<header className="menu__section-header">
				<TextInput
					id="menu__section-name"
					update={(e) => setEditName(e.target.value)}
					value={editName}
					placeholder="Name..."
					edit={true}
				/>
				<TextInput
					id="menu__section-description"
					update={(e) => setEditDescription(e.target.value)}
					value={editDescription}
					placeholder="Description..."
					edit={true}
				/>
				<ConfirmBar
					id="menu__section-confirm"
					cancel={() => setAddSection(false)}
					confirm={saveSection}
					hide={false}
				/>
			</header>
		);
	};

	return (
		<section className="menu__section">
			{renderHeader()}
		</section>
	);
}

export default AddMenuSection;
