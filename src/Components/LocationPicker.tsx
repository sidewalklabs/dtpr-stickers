import React, { Component } from 'react';
import * as MapboxGL from 'mapbox-gl';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import PlaceIcon from '@material-ui/icons/Place';


const ACCESS_TOKEN =
  'pk.eyJ1IjoiZGFudmsiLCJhIjoiY2lrZzJvNDR0MDBhNXR4a2xqNnlsbWx3ciJ9.myJhweYd_hrXClbKk8XLgQ';

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  injectCSS: false,
});

class LocationPicker extends Component<any, any> {
  map: any;
  mapContainer: any;

  onClick(map: MapboxGL.Map, evt: MapboxGL.MapMouseEvent) {
    this.props.onSelectLocation(evt.lngLat)
  }

  render() {
    const { markerLocation } = this.props
    return (
      <Map
        style={'mapbox://styles/mapbox/streets-v9'}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        onClick={(map, evt) => this.onClick(map, evt as any)}
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

export default LocationPicker;
