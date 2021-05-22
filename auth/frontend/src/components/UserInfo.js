import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(2),
  },
  topMargin: {
    marginTop: theme.spacing(2),
  },
}));

export default function UserInfo({ user }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper elevation={2} className={classes.padded}>
      <Typography component="h1" variant="h6">
        Welcome, {user.user_name}!
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.topMargin}
        disabled={window.location.pathname === "/"}
        onClick={() => {
          history.push("/");
        }}
      >
        home
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.topMargin}
        disabled={window.location.pathname === "/submissions"}
        onClick={() => {
          history.push("/submissions");
        }}
      >
        my submissions
      </Button>
      {user.user_permissions >= 10 && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.topMargin}
          disabled={window.location.pathname === "/new"}
          onClick={() => {
            history.push("/new");
          }}
        >
          add quiz
        </Button>
      )}
    </Paper>
  );
}
