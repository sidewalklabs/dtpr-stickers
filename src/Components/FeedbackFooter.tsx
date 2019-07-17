import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";

import ReactGA from "react-ga";
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_KEY || "");
ReactGA.set({ anonymizeIp: true });

const COLOR_POSITIVE = "#E5F6D2"
const COLOR_CRITICAL = "#F5CCDD"
const COLOR_NEUTRAL = "#FDEDD3"

type FeedbackType = 'positive' | 'critical' | 'neutral'

interface Props extends WithStyles<typeof styles> {
  placeName?: string;
  technology: string;
  email: string;
}

interface State {
  activeFeedbackButton: FeedbackType | ''
}

const styles = (theme: Theme) =>
  createStyles({
    dtprFeedbackContainer: {
      padding: "16px"
    },
    dtprFeedbackBox: {
      background: "#FAFAFA",
      border: "1px solid rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column"
    },
    feedbackTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      margin: "16px 0"
    },
    dtprFeedbackButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
    },
    dtprFeedbackButton: {
      border: "1px solid rgba(0, 0, 0, 0.1)",
      borderRadius: "24px",
      '&:hover': {
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }
    },
    feedbackSendButton: {
      backgroundColor: "#ffffff",
      border: "1px solid rgba(0, 0, 0, 0.15)",
      borderRadius: "28px",
      height: "48px",
      lineHeight: "36px",
      textTransform: "none",
      textAlign: "left",
      padding: "0 16px 0 20px",
      fontSize: "14px",
      color: "rgba(0,0,0,.7)",
      textIndent: 0,
      margin: "20px 20px",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    sendButtonIcon: {
      height: "20px",
      width: "20px"
    }
  });

class FeedbackFooter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeFeedbackButton: '',
    };
  }

  onFeedbackButtonClick(feedbackButton: FeedbackType) {
    const { technology } = this.props
    this.setState({ activeFeedbackButton: feedbackButton })

    ReactGA.event({
      category: 'User',
      action: `Clicked Feedback: ${feedbackButton}`,
      label: technology
    });
  }

  getHref() {
    const { placeName, email, technology } = this.props
    const { activeFeedbackButton } = this.state
    const feedbackSubject = `Some ${activeFeedbackButton} feedback for you about ${placeName}`
    const feedbackBody = `Hello, \n I'd like to share my thoughts on ${technology} ...`
    const mailUrl = `mailto:${email}?subject=${feedbackSubject}&body=${feedbackBody}`
    return mailUrl
  }


  render() {
    const { classes } = this.props;
    const { activeFeedbackButton } = this.state

    return (
      <div className={classes.dtprFeedbackContainer}>
        <div className={classes.dtprFeedbackBox}>
          <Typography className={classes.feedbackTitle}>
            How do you feel about this technology?
          </Typography>
          <div className={classes.dtprFeedbackButtons}>
            <Button
              variant="outlined"
              disableRipple
              className={classes.dtprFeedbackButton}
              style={{
                backgroundColor: COLOR_CRITICAL,
                opacity: activeFeedbackButton === 'critical' ? 1 : 0.5
              }}
              onClick={() => this.onFeedbackButtonClick("critical")}
            >
              <img src={"/images/feedback/feedback_sad.svg"} />
            </Button>
            <Button
              variant="outlined"
              disableRipple
              className={classes.dtprFeedbackButton}
              style={{
                backgroundColor: COLOR_NEUTRAL,
                opacity: activeFeedbackButton === 'neutral' ? 1 : 0.5
              }}
              onClick={() => this.onFeedbackButtonClick("neutral")}
            >
              <img src={"/images/feedback/feedback_meh.svg"} />
            </Button>
            <Button
              variant="outlined"
              disableRipple
              className={classes.dtprFeedbackButton}
              style={{
                backgroundColor: COLOR_POSITIVE,
                opacity: activeFeedbackButton === 'positive' ? 1 : 0.5
              }}
              onClick={() => this.onFeedbackButtonClick("positive")}
            >
              <img src={"/images/feedback/feedback_happy.svg"} />
            </Button>
          </div>
          <Button
            variant="outlined"
            color="primary"
            className={classes.feedbackSendButton}
            href={this.getHref()}
          >
            Email us your thoughts ...
            <SendIcon className={classes.sendButtonIcon} />
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FeedbackFooter);
