import React, { Component } from 'react';
import firebase from '../firebase.js';
import * as MapboxGL from 'mapbox-gl';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import { withRouter } from 'react-router-dom'


const ICONS: { [key: string]: string } = {
  traffic: 'https://static.thenounproject.com/png/6105-200.png',
  computerVision: 'https://previews.123rf.com/images/rtnr/rtnr1804/rtnr180400009/99164828-dabbing-person-icon.jpg',
}

const ACCESS_TOKEN =
  'pk.eyJ1IjoiZGFudmsiLCJhIjoiY2lrZzJvNDR0MDBhNXR4a2xqNnlsbWx3ciJ9.myJhweYd_hrXClbKk8XLgQ';

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  injectCSS: false,
});

class MapView extends Component<any, any> {
  map: any;
  mapContainer: any;
  constructor(props: any) {
    super(props);

    this.state = {
      items: [],
      markerLocation: null,
    };
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      if (snapshot) {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          const { sensorType, qr, purpose, identity, storage, access, disclosure, logo, lngLat } = items[item]
          newState.push({
            id: item,
            sensorType, qr, purpose, identity, storage, access, disclosure, logo, lngLat
          });
        }
        this.setState({
          items: newState
        });
      }
    });
  }

  lngLatToCoordinate(lngLat: MapboxGL.LngLat) {
    return [lngLat.lng, lngLat.lat]
  }

  render() {
    return (
      <Map
        style={'mapbox://styles/mapbox/streets-v9'}
        containerStyle={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0, right: 0,
          overflow: 'hidden'
        }}
        onClick={(map, evt: any) => this.setState({ markerLocation: evt.lngLat })}
      >
        {this.state.items.map((item: any) => {
          const coordinates = this.lngLatToCoordinate(item.lngLat)
          return <Marker
            key={item.id}
            coordinates={coordinates}
          >
            <img src={ICONS[item.sensorType]} height='30' />
          </Marker>
        })}
      </Map>
    );
  }
}

export default withRouter(MapView)
