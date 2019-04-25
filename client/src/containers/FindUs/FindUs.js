import React, { Component } from 'react';
import L from 'leaflet';
import './FindUs.scss';

import Address from '../../components/Address/Address';

export class ViewMap extends Component {
	componentDidMount() {
		const { location } = this.props;

		this.osm = L.map('mapid', {
			center: location.latlng,
			zoom: 16,
			layers: [
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}),
			]
		});

		this.marker = L.marker(location.latlng).addTo(this.osm);
	}
	
	render() {
		const { address } = this.props.location;

		return (
			<main className="find-us">
				<Address id="address" address={address} />
				<div className="find-us__map" id="mapid" />
			</main>
		);
	}
}

export default ViewMap;
