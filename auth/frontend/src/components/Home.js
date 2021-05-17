import React, { useState } from "react";
import { useCookies } from "react-cookie";

import Quiz from "./Quiz";

const questions = [
  {
    text: "Care este sensul vietii?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Care nu este sensul vietii?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Mi-l bei?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Mi-l sugi?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
];

export default function Home() {
  const [cookie] = useCookies(["token", "sessionInfo"]);

  return (
    <div className="home-page">
      <p>Welcome {cookie.session_info.user_name}</p>
      <Quiz questions={questions} />
    </div>
  );
}
