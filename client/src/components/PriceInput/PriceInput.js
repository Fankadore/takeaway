import React, { useEffect } from 'react';
import './PriceInput.scss';

const PriceInput = (props) => {
	const { id, update, value, currency, edit } = props;
	const price = parseFloat(value).toFixed(2);

	const resize = (e) => {
		update(e);
		const digits = e.target.value.toString().length - 1; // count digits discounting decimal point
		e.target.style.width = ((digits * 8) + 2) + 'px'; // convert to pixels
	};
	
	const parsePrice = (e) => {
		e.target.value = parseFloat(e.target.value).toFixed(2);
		resize(e);
	}
	
	useEffect(() => {
		if (edit) {
			const inputFields = document.getElementsByClassName(id + "-value");
			Array.from(inputFields).forEach(inputField => {
				inputField.value = parseFloat(inputField.value).toFixed(2);
			});
		}
	}, [edit]);

	return (
		<div id={id} className={id + " price-input"}>
			<p id={id + "-currency"} className={id + "-currency price-input__currency"}>{currency}</p>
			{(edit)
				? <input id={id + "-value"} type="number" step="0.01" className={id + "-value price-input__input"} onFocus={parsePrice} onBlur={parsePrice} onChange={resize} value={value} placeholder="0.00" />
				: <p id={id + "-value"} className={id + "-value price-input__display"}>{price}</p>
			}
		</div>
	);
}

export default PriceInput;
