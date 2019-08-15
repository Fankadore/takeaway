import React, { useState } from 'react';
import axios from 'axios';
import './MenuItem.scss';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import PriceInput from '../../components/PriceInput/PriceInput';
import TextInput from '../../components/TextInput/TextInput';

const AddMenuItem = ({ menu, setMenu, section, setAddItem, setPopup }) => {
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editPrice, setEditPrice] = useState(0);

	const saveItem = () => {
		if (!editName) {
			setPopup("Name is required.");
			return;
		}

		const newItem = {name: editName, description: editDescription, price: editPrice};

		axios.post(`http://localhost:2000/menu/section/${section._id}/item/`, newItem)
		.then(response => {
			newItem._id = response.data._id;
			const updatedItems = [...section.items, newItem];
			const updatedSections = menu.sections.map(sect => {
				if (sect._id === section._id) {
					sect.items = updatedItems;
				}
				return sect;
			});
			setMenu({...menu, sections: updatedSections});
			setAddItem(false);
		})
		.catch(err => console.log(err));
	};

	const renderDetails = () => {
		return (
			<>
				<TextInput
					id="menu__section__item-name"
					update={(e) => setEditName(e.target.value)}
					value={editName}
					placeholder="Name..."
					edit={true}
				/>
				<PriceInput
					id="menu__section__item-price"
					update={(e) => setEditPrice(e.target.value)}
					value={editPrice}
					currency="£"
					edit={true}
				/>
				<TextInput
					id="menu__section__item-description"
					update={(e) => setEditDescription(e.target.value)}
					value={editDescription}
					placeholder="Description..."
					edit={true}
				/>
			</>
		);
	}
	const renderConfirmBar = () => {
		return (
			<ConfirmBar
				id="menu__section__item-confirm"
				confirm={saveItem}
				cancel={() => setAddItem(false)}
				hide={false}
			/>
		);
	};

	return (
		<section className="menu__section__item">
			{renderDetails()}
			{renderConfirmBar()}
		</section>
	);
}

export default AddMenuItem;
