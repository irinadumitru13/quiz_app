import React from "react";
import { Paper, Typography } from "@material-ui/core";

export default function UserInfo({ user }) {
  return (
    <Paper elevation={2}>
      <Typography component="h1" variant="h6">
        Welcome, {user.user_name}!
      </Typography>
    </Paper>
  );
}
