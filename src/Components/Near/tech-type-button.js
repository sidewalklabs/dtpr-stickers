import React, {PureComponent} from 'react';
import Button from '@material-ui/core/Button';

const buttonStyle = {
 display: 'inline-block',
 padding: '0.2em 0.4em',
 margin: '0.1em, 0.1em, 2em, 2em',
 border: '0.15em solid #CCCCCC',
 boxSizing: 'border-box',
 textDecoration: 'none',
 color: '#000000',
 backgroundColor:'#FFF',
 textAlign: 'center',
 position: 'relative',
 height: '52px',
 minWidth: '104px'
}

const buttonTextStyle = {
  padding: '1em',
  textTransform: 'none'
}

const iconStyle = {
  verticalAlign: 'middle'
};

export default class TechTypeButton extends PureComponent {
  render() {
    const {techType, airtableData, onClick} = this.props;
    let icon;
    let name;
    let config;
    if (techType && airtableData) {
      config = airtableData.techType.find(
        option => option.name === techType
      );
      if (config) {
        icon = `/images/${config.iconShortname}.svg`;
        name = config.name;
      }
    }
  return (<Button onClick={event => onClick(event, techType)} style={buttonStyle}><img src={icon} style={iconStyle} alt={`${techType} icon`}/><span style={buttonTextStyle}>{name}</span></Button>);
  }
}
