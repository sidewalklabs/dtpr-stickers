import React, {PureComponent} from 'react';
import {Marker} from 'react-map-gl';
import technologyCategoryAdapater from './technology-category-adapter';

const pin = '/images/map/pin.svg';
const iconBgStyle = {
  position: 'absolute',
  top: 0,
  left: 0
};
const iconStyle = {
  position: 'absolute',
  top: -4,
  left: -5,
  transform: 'scale(0.5)'
};

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  // _onMarkerDragEnd used only for fine tuning lngLats for addition to the DB
  _onMarkerDragEnd = event => {
    console.log('=============> Marker dragged:');
    console.dir(event.lngLat);
  };

  render() {
    const {data, airtableData, onClick, classes} = this.props;

    return data.map((sensor, index) => {
      const { techType } = sensor;
      const featuredTechType =
              techType && techType.length ? techType[0] : undefined;
      const techCategory = technologyCategoryAdapater.getCategory(techType, airtableData);
      let icon;
      let config;


      if (techType && airtableData) {
        config = airtableData.techType.find(
          option => option.name === featuredTechType
        );
      }

      if (config) icon = `/images/${config.iconShortname}.svg`;

      return <div onClick={onClick} key={`marker-${index}`}>
        <Marker
          key={`marker-${index}`}
          longitude={sensor.longitude}
          latitude={sensor.latitude}
          draggable={true}
          onDragEnd={this._onMarkerDragEnd}
        >
          <img className={classes.iconBackground} src={pin} style={iconBgStyle} alt={`${techCategory} icon background`}/>
          {icon && <img className={classes.icon} src={icon} style={iconStyle} alt={`${techCategory} icon`}/>}
        </Marker>
      </div>
    });
  }
}
