import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(3),
    transitionDuration: "0.3s",
    transitionProperty: "transform",
    "&:hover": {
      transform: "scale(1.05)",
      cursor: "pointer",
    },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(1.5)",
  },
}));

export default function SubmissionPreview({ submission }) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Paper elevation={2} className={classes.padded}>
      <Typography noWrap component="h1" variant="h6">
        {submission.quiz_name}
      </Typography>
      <Typography noWrap>
        {bull}
        <b>{" User: "}</b>
        {submission.username}
      </Typography>
      <Typography noWrap>
        {bull}
        <b>{" Score: "}</b>
        {submission.score}
      </Typography>
      <Typography noWrap>
        {new Date(submission.time_stamp).toLocaleString()}
      </Typography>
    </Paper>
  );
}
