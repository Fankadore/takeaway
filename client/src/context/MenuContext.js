import React, { createContext, useReducer } from 'react';
import axios from 'axios';

export const menuContext = createContext({});

const initialState = {
	menus: null,
	selectedMenu: 0,
	editId: null,
	newId: null,
	name: "",
	description: "",
	price: 0,
	popup: "",
};

const reducer = (state, action) => {
	switch (action.type) {
		case "UPDATE_MENUS":
			return axios.get('http://localhost:2000/menu')
			.then(res => ({...state, menus: action.value }))
			.catch(err => console.log(err));
		case "SELECT_MENU":
			return {...state, selectedMenu: action.value};
		case "ADD_RESOURCE":
			return {...state, editId: null, newId: action.value, name: "", description: "", price: 0};
		case "EDIT_RESOURCE":
			if (!state.admin) return {...state};
			const {_id = null, name = "", description = "", price = 0} = action.value;
			return {...state, editId: _id, newId: null, name, description, price};
		case "CANCEL_EDIT":
			if (!state.admin) return {...state};
			return {...state, editId: null, newId: null, name: "", description: "", price: 0};
		case "MOVE_ITEM":
			
		case "HANDLE_INPUT":
			return {...state, [action.field]: action.value};
		case "HANDLE_PRICE":
			let newPrice = parseFloat(action.value);
			if (isNaN(newPrice) || newPrice < 0) newPrice = 0;
			return {...state, price: newPrice};
		case "ADD_TO_ORDER":
			return {...state};
		case "POPUP":
			return {...state, popup: action.value};
		default:
			throw new Error("Action type must be defined.");
	}
};

const MenuContext = ({children}) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { menus, selectedMenu } = state;

	const updateMenus = () => {
	
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
	
	const moveSection = (menu, startIndex, endIndex) => {
		const sections = moveResource(menu.sections, startIndex, endIndex);
	
		axios.put('http://localhost:2000/menu/' + menu._id, {sections})
		.then(result => dispatch({ type: "UPDATE_MENUS" }))
		.catch(err => console.log(err));
	};
	
	const moveItemToSection = (menu, itemId, oldSectionId, newSectionId) => {
		const oldSection = menu.sections.find(section => section._id === oldSectionId);
		const newSection = menu.sections.find(section => section._id === newSectionId);
		const item = oldSection.items.find(i => i._id === itemId);
		const oldItems = oldSection.items.filter(item => item._id !== itemId);
		const newItems = (newSection.items) ? [...newSection.items, item] : [item];
	
		axios.put('http://localhost:2000/menu/section/' + newSection._id, {items: newItems})
		.then(result => {
			axios.put('http://localhost:2000/menu/section/' + oldSection._id, {items: oldItems})
			.then(result => dispatch({ type: "UPDATE_MENUS" }))
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
	};
	
	return (
		<menuContext.Provider value={{
			state,
			dispatch,
			moveSection,
			moveItemToSection,
			menu: (menus) ? menus[selectedMenu] : null,
		}}>
			{children}
		</menuContext.Provider>
	);
}

export default MenuContext;
