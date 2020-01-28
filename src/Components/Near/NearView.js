import React, {Component} from 'react';
import MapGL, {Popup, NavigationControl, FullscreenControl, ScaleControl, GeolocateControl} from 'react-map-gl';

// import ControlPanel from './control-panel';
import Pins from './pins';
import CityInfo from './city-info';

import CITIES from './cities.json';

const fullscreenControlStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const navStyle = {
  position: 'absolute',
  top: 36,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  position: 'absolute',
  bottom: 36,
  left: 0,
  padding: '10px'
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: "8px"
};

const geolocateStyle = {
  position: 'absolute',
  top: 10,
  right: 10
};

class NearView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: '100vw',
        height: '100vh',
        latitude: 37.785164,
        longitude: -100,
        zoom: 3.5,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
  }

  updateViewport = viewport => {
    this.setState({viewport});
  };

  onClickMarker = city => {
    this.setState({popupInfo: city});
  };

  renderPopup() {
    const {popupInfo} = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({popupInfo: null})}
        >
          <CityInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  getMapBoundaries = () => {
    // Get map boundaries
    const myMap = this.mapReference.getMap();
    console.log(myMap.getBounds());
    const mapBoundaries = myMap.getBounds();
    this.setState({ mapBoundaries })
  }

  componentDidMount = () => {
    console.log('============> mapBoundaries: ', this.mapReference.getMap());
  }

  render() {
    const {viewport} = this.state;

    return (
      <MapGL
        containerStyle={mapContainerStyle}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this.updateViewport}
        ref={ref => this.mapReference = ref}
      >
        <Pins data={CITIES} onClick={this.onClickMarker} />

        {this.renderPopup()}

        <div style={navStyle}>
          <NavigationControl />
        </div>
        <div style={scaleControlStyle}>
          <ScaleControl />
        </div>
        <div>
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{enableHighAccuracy: true}}
          trackUserLocation={true}
        />
        </div>

        {/* <ControlPanel containerComponent={this.props.containerComponent} /> */}
      </MapGL>
    );
  }
}

export default NearView;
