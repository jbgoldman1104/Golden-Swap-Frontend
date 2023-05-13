import React, { useEffect, useState } from "react";
import _ from "lodash";
//IMPORTING STYLESHEET

import "../styles/patterns/leaderboard.scss";

//IMPORTING COMPONENTS

import LeaderboardData from "../components/leaderboardData";

//IMPORTING MEDIA ASSETS

import chevrondown from "../assets/icons/chevrondown.svg";
import loader from "../assets/icons/loader.gif";
import down from "../assets/icons/down.svg";

const Leaderboard = ({
  allTimeLeaderboard,
  dailyLeaderboard,
  weeklyLeaderboard,
  monthlyLeaderboard,
  isLoading,
}) => {
  const [selected, setSelected] = useState("All Time");
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [dataLength, setDataLength] = useState(10);

  useEffect(() => {
    setDataLength(10);
  }, [selected]);
  const allTimeLeaderboardSorted = _.orderBy(
    allTimeLeaderboard,
    ["earn"],
    ["desc"]
  );

  const dailyLeaderboardSorted = _.orderBy(
    dailyLeaderboard,
    ["earn"],
    ["desc"]
  );

  const weeklyLeaderboardSorted = _.orderBy(
    weeklyLeaderboard,
    ["earn"],
    ["desc"]
  );

  const monthlyLeaderboardSorted = _.orderBy(
    monthlyLeaderboard,
    ["earn"],
    ["desc"]
  );
  const handleDropdown = (value) => {
    if (value === "daily") setSelected("daily");
    if (value === "weekly") setSelected("weekly");
    if (value === "monthly") setSelected("monthly");
    if (value === "All Time") setSelected("All Time");

    setIsDropdownActive(false);
  };

  const renderDropDownLists = (
    <div
      className={isDropdownActive ? "dropdown_lists active" : "dropdown_lists"}
    >
      <p onClick={() => handleDropdown("All Time")}>All Time</p>
      <p onClick={() => handleDropdown("daily")}>Daily</p>
      <p onClick={() => handleDropdown("weekly")}>weekly</p>
      <p onClick={() => handleDropdown("monthly")}>monthly</p>
    </div>
  );

  const renderAlltimeLeaderboard = (
    <div>
      {allTimeLeaderboardSorted.slice(0, dataLength).map((value, index) => {
        return (
          <LeaderboardData
            title={index + 1}
            value={value}
            key={index.toString()}
          />
        );
      })}
      {allTimeLeaderboardSorted?.length > 10 && (
        <div
          className="referralFoot"
          onClick={() => setDataLength(dataLength + 10)}
        >
          <span className="text_accent_primary_12">view more</span>
          <img src={down} alt="down" />
        </div>
      )}
    </div>
  );

  const renderDailyLeaderboard = (
    <>
      {dailyLeaderboardSorted.length > 0 ? (
        dailyLeaderboardSorted.slice(0, dataLength).map((value, index) => {
          return (
            <LeaderboardData
              title={index + 1}
              value={value}
              key={index.toString()}
            />
          );
        })
      ) : (
        <div className="flex_center">No transactions yet</div>
      )}
      {dailyLeaderboardSorted?.length > 10 && (
        <div
          className="referralFoot"
          onClick={() => setDataLength(dataLength + 10)}
        >
          <span className="text_accent_primary_12">view more</span>
          <img src={down} alt="down" />
        </div>
      )}
    </>
  );

  const renderWeeklyLeaderboard = (
    <>
      {weeklyLeaderboardSorted.length > 0 ? (
        weeklyLeaderboardSorted.slice(0, dataLength).map((value, index) => {
          return (
            <LeaderboardData
              title={index + 1}
              value={value}
              key={index.toString()}
            />
          );
        })
      ) : (
        <div className="flex_center">No transactions yet</div>
      )}
      {weeklyLeaderboardSorted?.length > 10 && (
        <div
          className="referralFoot"
          onClick={() => setDataLength(dataLength + 10)}
        >
          <span className="text_accent_primary_12">view more</span>
          <img src={down} alt="down" />
        </div>
      )}
    </>
  );

  const renderMonthlyLeaderboard = (
    <div>
      {monthlyLeaderboardSorted.length > 0 ? (
        monthlyLeaderboardSorted.slice(0, dataLength).map((value, index) => {
          return (
            <LeaderboardData
              title={index + 1}
              value={value}
              key={index.toString()}
            />
          );
        })
      ) : (
        <div className="flex_center">No transactions yet</div>
      )}
      {monthlyLeaderboardSorted?.length > 10 && (
        <div
          className="referralFoot"
          onClick={() => setDataLength(dataLength + 10)}
        >
          <span className="text_accent_primary_12">view more</span>
          <img src={down} alt="down" />
        </div>
      )}
    </div>
  );
  return (
    <div>
      <div className="leaderboard webLeaderboard">
        <div className="leaderboard-head">
          <p className="text_lite_16">Leaderboard</p>
          <p className="text_lite_12">
            the best sellers are listed here. Start refering to see yourself
            here.
          </p>
        </div>
        <div
          className="dropdown"
          onClick={() => setIsDropdownActive(!isDropdownActive)}
        >
          <p>
            <span className="text_accent_primary_14">{selected}</span>
            <img src={chevrondown} alt="dropdown" width={20} />
          </p>
          {renderDropDownLists}
        </div>
        {isLoading ? (
          <div className="leaderboard_loader text_accent_primary_14">
            <img src={loader} alt="loader" width={30} />
          </div>
        ) : (
          <div className="list">
            {
              {
                daily: renderDailyLeaderboard,
                weekly: renderWeeklyLeaderboard,
                monthly: renderMonthlyLeaderboard,
                "All Time": renderAlltimeLeaderboard,
              }[selected]
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
