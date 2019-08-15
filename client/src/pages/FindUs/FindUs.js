import React from 'react';
import './FindUs.scss';

import Address from '../../components/Address/Address';
import MapTile from '../../components/MapTile/MapTile';
import Arrow from '../../components/Arrow/Arrow';

const FindUs = ({ id, location, previousLocation, nextLocation }) => {
	const { address, latlng } = location;

	return (
		<main id={id}>
			<Arrow id={id + "__previous"} direction="left" onClick={previousLocation} />
			<Address id={id + "__address"} address={address} />
			<Arrow id={id + "__next"} direction="right" onClick={nextLocation} />
			<MapTile id={id + "__map"} latlng={latlng} />
		</main>
	);
};

export default FindUs;
