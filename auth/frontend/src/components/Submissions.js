import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import UserInfo from "./UserInfo";
import SubmissionList from "./SubmissionList";
import { getQuizStatistics } from "../api";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 10,
  },
}));

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  const { quizName } = useParams();
  const classes = useStyles();
  const [cookie] = useCookies(["token"]);
  const alert = useAlert();

  useEffect(() => {
    async function fetchSubmissionsByName() {
      try {
        const resp = await getQuizStatistics(cookie.token, decodeURI(quizName));
        setSubmissions(resp);
      } catch (e) {
        alert.show(e.message);
      }
    }

    if (quizName !== undefined) {
      fetchSubmissionsByName();
    }
  }, [alert]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <UserInfo user={cookie.session_info} />
        </Grid>
        <Grid item xs={9}>
          <SubmissionList submissions={submissions} />
        </Grid>
      </Grid>
    </div>
  );
}
