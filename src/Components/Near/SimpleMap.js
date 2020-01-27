import React, { Component } from "react";
import MapGL, {Popup, NavigationControl, FullscreenControl, ScaleControl} from 'react-map-gl';
import Pins from './pins';
import CITIES from './cities.json';
class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: '100%',
        height: '100%',
        latitude: 37.785164,
        longitude: -100,
        zoom: 3.5,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
  }

  _updateViewport = viewport => {
    this.setState({viewport});
  };

  _onClickMarker = city => {
    console.log('=============>PIN CLICKED ');
    // this.setState({popupInfo: city});
  };

  render() {
    const {viewport} = this.state;
    return (
      <MapGL
      {...viewport}
      containerStyle={{
        width: "100%",
        height: "100%",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: "8px"
      }}
      onViewportChange={this._updateViewport}
      >
        <Pins data={CITIES} onClick={this._onClickMarker} />
      </MapGL>
    );
  }
}

export default SimpleMap;
