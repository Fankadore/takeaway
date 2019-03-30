import React from 'react';

function Footer(props) {
	const { copyright } = props;

	return (
		<footer className="footer">
			<p className="footer__copyright">{copyright}</p>
		</footer>
	)
}

export default Footer;
