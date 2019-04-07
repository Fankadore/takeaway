import React, { Component } from 'react';
import L from 'leaflet';
import './ViewMap.scss';

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
			<main className="view-map">
				<p className="view-map__address">{this.props.address.street}</p>
				<p className="view-map__address">{this.props.address.city}</p>
				<p className="view-map__address">{this.props.address.postcode}</p>
				<div className="view-map__map" id="mapid"></div>
		</main>
		)
	}
}

export default ViewMap;
