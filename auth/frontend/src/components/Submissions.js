import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useCookies } from "react-cookie";

import { getQuizStatistics } from "../api";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  let { quizName } = useParams();
  const [cookie] = useCookies(["token"]);
  const alert = useAlert();

  useEffect(() => {
    async function fetchSubmissionsByName() {
      try {
        const response = await getQuizStatistics(
          cookie.token,
          decodeURI(quizName)
        );
        console.log(response);
      } catch (e) {
        alert.show(e.message);
      }
    }

    if (quizName !== undefined) {
      fetchSubmissionsByName();
    }
  }, [alert]);

  return <div>This is the submissions page for {quizName}</div>;
}
