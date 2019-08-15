import React from 'react';
import './Loading.scss';

import Spinner from '../../components/Spinner/Spinner';

const Loading = () => {
	return (
		<main className="loading">
			<Spinner id="loading__spinner" />
		</main>
	);
};

export default Loading;
