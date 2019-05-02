import React from 'react';
import './FindUs.scss';

import Address from '../../components/Address/Address';
import MapTile from '../../components/MapTile/MapTile';

function FindUs(props) {
	const { address, latlng } = props.location;
	const id = "find-us"
	return (
		<main id={id}>
			<Address id={id + "__address"} address={address} />
			<MapTile id={id + "__map"} latlng={latlng} />
		</main>
	);
}

export default FindUs;
