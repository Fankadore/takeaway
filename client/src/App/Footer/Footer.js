import React from 'react';
import './Footer.scss';

const Footer = ({ copyright }) => {
	return (
		<footer className="footer">
			<p className="footer__copyright">{copyright}</p>
		</footer>
	)
}

export default Footer;
