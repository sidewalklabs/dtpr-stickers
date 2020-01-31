import React, {PureComponent} from 'react';
import {Marker} from 'react-map-gl';

const pin = `/images/container/map-pin.svg`;

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {
    const {data, airtableData, onClick, classes} = this.props;

    return data.map((sensor, index) => {
      const { purpose } = sensor;
      const featuredPurpose = purpose && purpose.length ? purpose[0] : undefined;

      let icon;
      let config;

      if (featuredPurpose && airtableData) {
        config = airtableData.purpose.find(
          option => option.name === featuredPurpose
        );
      }
      if (config) icon = `/images/${config.iconShortname}.svg`;

      return <div onClick={onClick} key={`marker-${index}`}>
        <Marker key={`marker-${index}`} longitude={sensor.longitude} latitude={sensor.latitude}>
          <img className={classes.icon} src={icon} alt={`${featuredPurpose} icon`}/>
          {/* <img className={classes.iconBackground} src={pin} alt={`${featuredPurpose} icon background`}/> */}
        </Marker>
      </div>
    });
  }
}
