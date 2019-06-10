import React, { Component } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import PlaceIcon from '@material-ui/icons/Place';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  injectCSS: false,
  interactive: false,
});

class StaticMap extends Component<any, any> {
  map: any;
  mapContainer: any;

  render() {
    const { markerLocation, center } = this.props
    return (
      <Map
        style={'mapbox://styles/mapbox/streets-v9'}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        center={center}
        zoom={[16]}
      >
        {markerLocation && <Marker
          coordinates={markerLocation}
        >
          <PlaceIcon color='primary' fontSize='large' />
        </Marker>}
      </Map>
    );
  }
}

export default StaticMap;
