import React, {PureComponent} from 'react';
import Button from '@material-ui/core/Button';
import technologyCategoryAdapater from './technology-category-adapter';

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
  textTransform: 'capitalize'
}

const iconStyle = {
  verticalAlign: 'middle'
};

export default class TechTypeButton extends PureComponent {
  render() {
    const {techType, airtableData, onClick, showCategory} = this.props;
    let category;
    let icon;
    let name;
    let config;
    if (showCategory) {
      category = technologyCategoryAdapater.getCategory(techType, airtableData);
    }
    if (techType && airtableData) {
      config = airtableData.techType.find(
        option => option.name === techType
      );
      if (config) {
        icon = `/images/${config.iconShortname}.svg`;
        name = config.name;
      }
    }
  return (<Button onClick={event => onClick(event, techType)} style={buttonStyle}><img src={icon} style={iconStyle} alt={`${techType} icon`}/><span style={buttonTextStyle}>{category || name}</span></Button>);
  }
}
