import React, { useEffect } from 'react';
import L from 'leaflet';
import './MapTile.scss';

function MapTile(props) {
	const { id, latlng } = props;

	const loadMap = () => {
		const osm = L.map(id, {
			center: latlng,
			zoom: 16,
			scrollWheelZoom: false,
			dragging: false,
			layers: [
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
				}),
			]
		});

		L.marker(latlng).addTo(osm);
	};

	useEffect(loadMap);

	return <div id={id} className="find-us__map" />
}

export default MapTile;
