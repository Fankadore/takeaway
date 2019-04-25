import React from 'react';
import './PriceInput.scss';

const PriceInput = (props) => {
	const { id, update, value, currency, edit } = props;
	const price = parseFloat(value).toFixed(2);
	const currencyId = id + "-currency";
	const valueId = id + "-value";

	const parsePrice = (e) => e.target.value = parseFloat(e.target.value).toFixed(2);

	return (
		<div id={id} className="price-input">
			<p id={currencyId} className="price-input__currency">{currency}</p>
			{(edit)
				? <input id={valueId} type="number" step="0.01" className="price-input__input" onFocus={parsePrice} onBlur={parsePrice} onChange={update} value={value} placeholder={0} />
				: <p id={valueId} className="price-input__display">{price}</p>
			}
		</div>
	);
}

export default PriceInput;
