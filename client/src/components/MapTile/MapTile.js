import React, { useEffect } from 'react';
import L from 'leaflet';
import './MapTile.scss';

function MapTile({ id, latlng }) {
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
			],
		});

		L.marker(latlng).addTo(osm);
	};
	
	useEffect(loadMap, []);

	return <div id={id} className={id + "__map map"} />
}

export default MapTile;
