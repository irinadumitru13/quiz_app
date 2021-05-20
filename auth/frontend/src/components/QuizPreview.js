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
}));

export default function QuizPreview({ quizTitle, status }) {
  const classes = useStyles();

  const statusClass =
    status === "open"
      ? classes.statusOpen
      : status === "ended"
      ? classes.statusEnded
      : classes.statusInFuture;

  return (
    <Paper className={classes.padded}>
      <Typography component="h1" variant="h6">
        {quizTitle}
      </Typography>
      <Typography className={statusClass}>{status}</Typography>
    </Paper>
  );
}
