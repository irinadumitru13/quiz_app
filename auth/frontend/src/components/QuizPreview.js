import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(4),
    transitionDuration: "0.3s",
    transitionProperty: "transform",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  statusOpen: {
    color: "green",
  },
  statusEnded: {
    color: "red",
  },
  statusInFuture: {
    color: "gray",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(1.5)",
  },
}));

export default function QuizPreview({ quizTitle, status, onClick }) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const statusClass =
    status === "open"
      ? classes.statusOpen
      : status === "ended"
      ? classes.statusEnded
      : classes.statusInFuture;

  return (
    <Paper className={classes.padded} onClick={onClick}>
      <Typography component="h1" variant="h6">
        {quizTitle}
      </Typography>
      <Typography>
        <span className={statusClass}>{bull}</span>
        {" Status: "}
        <span className={statusClass}>{status}</span>
      </Typography>
    </Paper>
  );
}
