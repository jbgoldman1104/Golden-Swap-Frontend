import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { numFormatter } from "../utils/util";
import Web3 from "web3";

//IMPORTING STYLESHEET

import "../styles/components/leaderboardData.scss";

//IMPORTING COMPONENTS

import HashLinks from "./hashLinks";

//IMPORTING MEDIA ASSETS

import dogeSmall from "../assets/icons/dogeSmall.svg";
import logo from "../assets/logos/logo.png";
import axios from "axios";

function LeaderboardData({ title, value }) {
  const [data, setData] = useState(0);

  // useEffect(() => {
  //   handleReferrer();
  // }, []);

  // const handleReferrer = async () => {
  //   try {
  //     // const {
  //     //   data: { result },
  //     // } = await axios.get(
  //     //   `https://api.dogedealercoin.com/server_app/getReferrals/${value.leader}`
  //     // );

  //     const {
  //       data: { result },
  //     } = await axios.get(`http://localhost:5000/getReferrals/${value.leader}`);
  //     setData(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="leaderBoard">
      <div className="header">
        <p className="text_accent_primary_14">place {title}#</p>
        <HashLinks variant="primary" data={value.leader} />
      </div>
      <div>
        <div>
          <p className="text_accent_primary_22">
            {value.earn > 999
              ? numFormatter(value.earn)
              : parseFloat(value.earn)?.toFixed(2)}
          </p>
          <p className="leaderDoge">
            <img src={logo} alt="doge" width={20} />
          </p>
          <p className="text_accent_primary_14R">EARNED</p>
        </div>
        <div>
          <p className="text_accent_primary_22">{numFormatter(data)}</p>
          <p className="text_accent_primary_11R">Referrals</p>
          <p className="text_accent_primary_14R">COMPLETED</p>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardData;
