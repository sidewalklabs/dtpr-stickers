import React, { Component } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'calc(100% - 167px)',
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 4,
    },
  },
});

class Home extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h3">Designing for Digital Transparency in the Public Realm</Typography>

        <Typography paragraph><a href='https://sidewalklabs.com/dtpr/' target="_blank">Digital Transparency in the Public Realm</a> is a project that seeks to facilitate the co-creation of prototypes that can advance digital transparency and enable agency in the world's public spaces.</Typography>
        <Typography paragraph>With cities increasingly embracing digital technology in the built environment, we believe people should be able to quickly understand how these technologies work and the purposes they serve. We believe that creating a unified visual language will be a critical starting point, and that digital tools could help people to follow up and learn more.</Typography>
        <Typography paragraph>Expert groups came together in cities around the world in co-design sessions to collaborate and prototype an initial set of open standards for digital transparency in the public realm. These standards, as well as all the workshop activities and materials that generated them, are publicly and freely available for others to adopt, use, and build upon.</Typography>

        <Typography style={{ fontWeight: 'bold' }} paragraph>We’re looking for partners who want to advance the use and adoption of these standards in the public realm. Please get in touch at <a href="mailto:someone@yoursite.com">dtpr-hello@sidewalklabs.com</a>.</Typography>

        <img width='100%' src="https://sidewalklabs.com/assets/uploads/2019/03/Process.png" alt="Illustration of the DTPR development process"></img>

        <Typography gutterBottom variant="h4">The DTPR Design Patterns and Prototypes - V1</Typography>
        <Typography paragraph>There are four major components to DTPR - <span style={{ fontWeight: 'bold' }}>icons</span>, a <span style={{ fontWeight: 'bold' }}>signage system</span>, and a <span style={{ fontWeight: 'bold' }}>digital channel</span> for communication -  which together, help visualize and convey a <span style={{ fontWeight: 'bold' }}>taxonomy of key concepts</span>.</Typography>

        <Typography gutterBottom variant="h6">Icons</Typography>
        <Typography paragraph>You can download the <a href='https://github.com/sidewalklabs/dtpr/tree/master/dtpr_icons' target="_blank">icon files and visual system</a> from Github.</Typography>

        <Typography gutterBottom variant="h6">Design Guide</Typography>
        <Typography paragraph>The <a href='https://github.com/sidewalklabs/dtpr/blob/master/dtpr_designguide/DTPR_Design_Guide.pdf' target="_blank">design guide</a> has what you need to know in order to actually create signs using the icons or add the icons to existing signage.</Typography>

        <Typography gutterBottom variant="h6">Taxonomy</Typography>
        <Typography paragraph>The taxonomy is the full set of definitions on which the icons are based. These definitions are also used in the prototype of the digital channel. The initial draft of the taxonomy and the associated icons are managed in an Airtable, which you can see <a href='https://airtable.com/shrsW7o7ji3VjsZSz' target="_blank">here</a>.</Typography>

        <Typography gutterBottom variant="h6">Prototype for the Digital Channel</Typography>
        <Typography paragraph>When you scan a QR code on a sign, it brings you to a dedicated page on this website where you can get more information. It’s currently set up for 307, Sidewalk Labs’ Toronto office and experimental workspace.</Typography>

        <Typography gutterBottom variant="h6">Privacy</Typography>
        <Typography paragraph>The DTPR website abides by the Sidewalk Labs privacy policy available <a href='https://github.com/sidewalklabs/docs/blob/master/privacy-policy.md' target="_blank">here</a>.</Typography>

        <Typography gutterBottom variant="h6">Co-Design Kit</Typography>
        <Typography paragraph>In the course of developing the initial prototypes, we developed materials and a facilitation guide that was used to run our co-design sessions. All the materials are provided <a href='https://github.com/sidewalklabs/dtpr/tree/master/dtpr_codesignkit' target="_blank">here</a> so that anyone, anywhere, can take up these tools and use them to engage in this crucial topic.</Typography>

        <Typography gutterBottom variant="h6">Contributors</Typography>
        <Typography paragraph>The development of these design patterns and prototypes would not have been possible without the large number of contributors who invested their expertise and time in this project. They are listed <a href='https://github.com/sidewalklabs/dtpr/blob/master/contributors.md' target="_blank">here</a>.</Typography>

        <Typography gutterBottom variant="h6">License</Typography>
        <Typography paragraph>The <span style={{ fontStyle: 'italic' }}>Icons</span>, <span style={{ fontStyle: 'italic' }}>Design Guide</span>and <span style={{ fontStyle: 'italic' }}>Taxonomy</span> for DTPR are licensed by the Digital Transparency in the Public Realm contributors under the <a href='https://creativecommons.org/licenses/by/4.0/' target="_blank">Creative Commons Attribution 4.0 International (CC BY 4.0)</a>.
Portions of the <span style={{ fontStyle: 'italic' }}>DTPR Icons</span> incorporate elements of, or are derived from, the <a href='https://material.io/tools/icons/' target="_blank">Material icons</a>. The Material icons are available under the <a href='https://www.apache.org/licenses/LICENSE-2.0.html' target="_blank">Apache License 2.0</a>.
          The source code for the *Digital Channel Prototype* is licensed under <a href='https://www.apache.org/licenses/LICENSE-2.0.html' target="_blank">Apache License 2.0</a>.
Sidewalk Labs trademarks and other brand features within these works are not included in this license.</Typography>

      </div>
    );
  }
}

export default withStyles(styles)(Home);
