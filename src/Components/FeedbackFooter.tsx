import firebase from "../firebase.js";
import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SendIcon from "@material-ui/icons/Send";

interface Props extends WithStyles<typeof styles> {
  placeName?: string;
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
    dtprFeedbackButton: {
      padding: "12px 24px"
    },
    feedbackNegative: {
      backgroundColor: "#F5CCDD",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      borderRadius: "24px",
      overflow: "visible",
      float: "left",
      marginLeft: "20px",
      "&:hover": {
        backgroundColor: "#F5CCDD",
        border: "1px solid rgba(0, 0, 0, 0.1)"
      },
      "&:active": {
        border: "1px solid rgba(0, 0, 0, 0.1)"
      },
      "&:focus": {
        border: "1px solid rgba(0, 0, 0, 0.1)"
      }
    },
    feedbackMeh: {
      backgroundColor: "#FDEDD3",
      border: "0.5px solid rgba(0, 0, 0, 0.1)",
      borderRadius: "24px",
      overflow: "visible",
      "&:hover": {
        backgroundColor: "#FDEDD3",
        border: "1px solid rgba(0, 0, 0, 0.1)"
      },
      "&:active": {
        border: "1px solid rgba(0, 0, 0, 0.1)"
      },
      "&:focus": {
        border: "1px solid rgba(0, 0, 0, 0.1)"
      }
    },
    feedbackPositive: {
      backgroundColor: "#E5F6D2",
      border: "0.5px solid rgba(0, 0, 0, 0.1)",
      borderRadius: "24px",
      overflow: "visible",
      float: "right",
      marginRight: "20px",
      "&:hover": {
        backgroundColor: "#E5F6D2",
        border: "1px solid rgba(0, 0, 0, 0.1)"
      },
      "&:active": {
        border: "1px solid rgba(0, 0, 0, 0.1)"
      },
      "&:focus": {
        border: "1px solid rgba(0, 0, 0, 0.1)"
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
      display: "block"
    },
    sendButtonIcon: {
      float: "right",
      marginTop: "8px",
      height: "20px",
      width: "20px"
    }
  });

// const NegativeButton = withStyles((theme: Theme) => ({
//   root: {
//     backgroundColor: "#F5CCDD",
//     border: "1px solid #F5CCDD",
//     "&:hover": {
//       backgroundColor: "#F5CCDD"
//     }
//   }
// }))(Button);

class FeedbackFooter extends Component<Props, any> {
  mailtoFeedback(subject: string) {
    var FeedbackSubject =
      "Some " + subject + " feedback for you about " + this.props.placeName;
    var FeedbackBody =
      "Hello, \nI'd like to share my thoughts on " +
      window.document.title +
      "...";
    const mailUrl =
      "mailto:dtpr-hello@sidewalklabs.com?subject=" +
      FeedbackSubject +
      "&body=" +
      FeedbackBody;
    window.location.href = mailUrl;
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.dtprFeedbackContainer}>
        <div className={classes.dtprFeedbackBox}>
          <Typography className={classes.feedbackTitle}>
            How do you feel about this technology?
          </Typography>
          <div>
            <Button
              variant="outlined"
              color="primary"
              className={classes.feedbackNegative}
              onClick={() => this.mailtoFeedback("critical")}
            >
              <img src={"/images/feedback/feedback_sad.svg"} />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.feedbackMeh}
              onClick={() => this.mailtoFeedback("neutral")}
            >
              <img src={"/images/feedback/feedback_meh.svg"} />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.feedbackPositive}
              onClick={() => this.mailtoFeedback("positive")}
            >
              <img src={"/images/feedback/feedback_happy.svg"} />
            </Button>
          </div>
          <Button
            variant="outlined"
            color="primary"
            className={classes.feedbackSendButton}
            onClick={() => this.mailtoFeedback("general")}
          >
            Say more about why…
            <SendIcon className={classes.sendButtonIcon} />
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FeedbackFooter);
