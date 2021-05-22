import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography, Paper, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";

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
  marginTop: {
    marginTop: theme.spacing(1),
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
  spread: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    borderRadius: theme.spacing(4),
    "&:hover": {
      color: "red",
    },
  },
}));

export default function QuizPreview({ quiz, canEdit, onQuizClick }) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const history = useHistory();

  const statusClass =
    quiz.status === "open"
      ? classes.statusOpen
      : quiz.status === "ended"
      ? classes.statusEnded
      : classes.statusInFuture;

  const handleClick = () => {
    if (quiz.status === "open") {
      onQuizClick();
      return;
    }
    console.log("not available");
  };

  return (
    <Paper className={classes.padded} onClick={handleClick}>
      <Typography noWrap component="h1" variant="h6" className={classes.spread}>
        {quiz.quiz_name}
        {canEdit && quiz.status !== "ended" && (
          <IconButton
            className={classes.editButton}
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/edit/${quiz.quiz_id}`);
            }}
          >
            <EditIcon />
          </IconButton>
        )}
      </Typography>
      <Typography>
        <span className={statusClass}>{bull}</span>
        {" Status: "}
        <span className={statusClass}>{quiz.status}</span>
      </Typography>
      {canEdit && (
        <Button
          className={classes.marginTop}
          fullWidth
          variant="contained"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/submissions/${encodeURI(quiz.quiz_name)}`);
          }}
        >
          view submissions
        </Button>
      )}
    </Paper>
  );
}
