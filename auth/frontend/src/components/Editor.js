import React from "react";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import QuizEditor from "./QuizEditor";
import UserInfo from "./UserInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 10,
  },
}));

export default function Editor() {
  const classes = useStyles();
  const [cookie] = useCookies(["token", "session_info"]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <UserInfo user={cookie.session_info} />
        </Grid>
        <Grid item xs={9}>
          <QuizEditor token={cookie.token} />
        </Grid>
      </Grid>
    </div>
  );
}
