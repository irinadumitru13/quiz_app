import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(2),
  },
}));

export default function UserInfo({ user }) {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.padded}>
      <Typography component="h1" variant="h6">
        Welcome, {user.user_name}!
      </Typography>
    </Paper>
  );
}
