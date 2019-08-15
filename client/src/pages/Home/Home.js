import React from 'react';
import './Home.scss';

function Home() {
	return (
		<main className="home">
			<h1 className="home__title">Home</h1>
			<ul className="home__list">
				<li className="home__list-item">Item 1</li>
				<li className="home__list-item">Item 2</li>
				<li className="home__list-item">Item 3</li>
			</ul>
		</main>
	)
}

export default Home;
