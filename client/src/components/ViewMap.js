import React, { Component } from 'react';
import L from 'leaflet';

export class ViewMap extends Component {
	componentDidMount() {
		this.osm = L.map('mapid', {
			center: this.props.address.latlng,
			zoom: 16,
			layers: [
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}),
			]
		});

		this.marker = L.marker(this.props.address.latlng).addTo(this.osm);
	}

	render() {
		return (
			<main className="main">
				<h1 className="main__title">Map</h1>
				<div className="main__map" id="mapid"></div>
		</main>
		)
	}
}

export default ViewMap;
