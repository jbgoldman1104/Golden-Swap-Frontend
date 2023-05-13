import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { CopyToClipboard } from "react-copy-to-clipboard";
import queryString from "query-string";
import { useLocation, Link } from "react-router-dom";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

//STYLESHEET

import "../styles/pages/dashboard.scss";

//IMPORTING PATTERNS

import Modal from "../patterns/modal";
import PaymentModal from "../patterns/paymentModal";

//IMPORTING MEDIA ASSETS

import logo from "../assets/logos/logo.png";
import dogecoin from "../assets/logos/dogecoin.svg";
import binance from "../assets/logos/binance.svg";
import user from "../assets/icons/user.svg";
import hash from "../assets/icons/hash.svg";
import creditcard from "../assets/icons/creditcard.svg";
import refresh from "../assets/icons/refresh.svg";
import circle from "../assets/icons/circle.svg";
import chevrondown from "../assets/icons/chevrondown.svg";
import copy from "../assets/icons/copy.svg";
import radio from "../assets/icons/radio.svg";
import radioFilled from "../assets/icons/radioFilled.svg";
import award from "../assets/icons/award.svg";
import users from "../assets/icons/users.svg";
import home from "../assets/icons/home.svg";

import { getReferalRewards, pcsAbi, pcsAddress } from "../utils/util";
import { abi, address, TokenList } from "../utils/constants";
import UserModal from "../patterns/userModal";
import Leaderboard from "../patterns/leaderboard";
import Referrals from "../patterns/referrals";
import { useEagerConnect } from "../utils/hooks.ts";
import { unatomic } from "../utils/util";
import { referals } from "../utils/leaderboard";
import { numFormatter } from "../utils/util";
import { test } from "../utils/leaderboard";

import https from 'https';

const selectRewardTokenDropdown = {
  hidden: { opacity: 0, transform: "translateY(10px) scale(0)" },
  visible: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
};

const Dashboard = () => {
  const location = useLocation();
  const triedEager = useEagerConnect();

  const [initialLoad, setInitialLoad] = useState(true);
  const [userProfile, setUserProfile] = useState(false);
  const [rewardCoinModal, setRewardCoinModal] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState(false);
  const [isLeaderBoard, setIsLeaderBoard] = useState(false);
  // const [isReferrals, setIsReferrals] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dogexBalance, setDogexBalance] = useState();
  const [referrerAddress, setReferrerAddress] = useState();
  const [referralData, setRefferalData] = useState([]);
  const [rewardTokenName, setRewardTokenName] = useState();
  const [reinvestingInfo, setReinvestingInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState([]);
  const [dailyLeaderboard, setDailyLeaderboard] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([]);
  const [TotalReferrals, setTotalReferrals] = useState(0);

  const [autoDividendEarnings, setAutoDividendEarnings] = useState(0);
  const [withdrawable, setWithdrawable] = useState(0);
  // const [referalEarnings, setReferalEarnings] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [paid, setPaid] = useState(0);
  const [position, setPosition] = useState();
  const [buy, setBuy] = useState(0);
  const [selectedToken, setSelectedToken] = useState(
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
  );
  const [payoutToken, setPayoutToken] = useState("BNB");
  const [decimals, setDecimals] = useState();
  const [nativeDecimals, setNativeDecimals] = useState();
  const [payoutTokenAddress, setPayoutTokenAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  const { active, library, account } = useWeb3React();
  const web3 = new Web3(library);
  console.log("[AL], contract address = ", address);
  const contract = new web3.eth.Contract(abi, address);
  const bnb = {
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    decimal: 18,
  };

  // Working
  const getUserToken = async () => {
    const nativeDecimal = await contract.methods.decimals().call();
    const userTokenAddress = await contract.methods
      .getPayoutToken(account)
      .call();

    console.log(userTokenAddress);

    let Token;
    let decimal;
    let name;

    if (userTokenAddress !== "0x0000000000000000000000000000000000000000") {
      Token = new web3.eth.Contract(abi, userTokenAddress);
      decimal = await Token.methods.decimals().call();
      name = await Token.methods.name().call();

      return {
        name: name,
        decimal: decimal,
        nativeDecimal: nativeDecimal,
        userToken: userTokenAddress,
      };
    }
  };

  // const getReinvestingInfo = () => {
  //   return contract.methods.isReinvest(account).call();
  // };

  const getTotalDividendDistributed = async () => {
    console.log("[AL] Dashboard - getTotalDividendDistributed()")
    return unatomic(
      await contract.methods.getTotalDividendsDistributed().call(),
      18
    );
  };

  const getWithdrawable = async () => {
    console.log("[AL] Dashboard - getWithdrawable()")
    return unatomic(
      await contract.methods.withdrawableDividendOf(account).call(),
      18
    );
  };

  // Working: Get balance of LemonSwap
  const getDogexBalance = async () => {
    return unatomic(await contract.methods.balanceOf(account).call(), 9);
  };

  // Working : 
  const accountInfo = async () => {
    const dividendEarned = await contract.methods
      .getAccountDividendsInfo(account)
      .call();
    setPosition(Number(dividendEarned[2]));
    setPaid(unatomic(dividendEarned[4], bnb.decimal));
    return unatomic(
      (dividendEarned[4] - dividendEarned[3]).toString(),
      bnb.decimal
    );
  };

  const handleGetInitialStatus = async () => {
    console.log("[AL], handleGetInitialSTatus");
    setDogexBalance(await getDogexBalance());
    setAutoDividendEarnings(await accountInfo());

    const user = await getUserToken();

    if (user !== undefined) {
      console.log(user);
      setPayoutToken(user.name);
      setPayoutTokenAddress(user.userToken);
      setDecimals(user.decimals);
      setNativeDecimals(user.nativeDecimal);
    } else {
      setPayoutToken("BNB");
      setPayoutTokenAddress("0x0000000000000000000000000000000000000000");
    }
    setWithdrawable(await getWithdrawable());
    // setReinvestingInfo(await getReinvestingInfo());
    setTotalDividend(await getTotalDividendDistributed());
  };

  useEffect(async () => {
    setInitialLoad(true);
    setTimeout(() => {
      setInitialLoad(false);
    }, 2000);
    if (active) {
      handleGetInitialStatus();
      await accountInfo();
      // const { referrer } = queryString.parse(location.search);
      // handleIsvalidAcceptReferrerr(referrer);
      // setAutoDividendEarnings(await accountInfo(userTokenAddress));
    }
  }, [active, account, library, selectedToken]);

  useEffect(() => {
    // handleReferrals();
    // handleLeaderboardData();
  }, [account]);

  // const handleIsvalidAcceptReferrerr = async (val) => {
  //   console.log(val);
  //   const contract = new new Web3(library).eth.Contract(abi, address);
  //   const data = await contract.methods.getReferrer().call();
  //   console.log(data);
  //   if (data === "0x0000000000000000000000000000000000000000") {
  //     setReferrerAddress(val);
  //     console.log("entered");
  //   } else {
  //     setReferrerAddress();
  //   }
  // };

  // const handleReferrals = async () => {
  //   try {
  //     const data = await referals(account);
  //     setRefferalData(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleReinvesting = async (value) => {
  //   setIsProcessing(true);
  //   try {
  //     await contract.methods.setReinvest(value).send({ from: account });
  //     setIsProcessing(false);
  //     setIsSuccess(true);
  //     handleGetInitialStatus();
  //     setTimeout(() => {
  //       setIsSuccess(false);
  //     }, 3000);
  //   } catch (error) {
  //     console.log(error);
  //     setRewardTokenName();
  //     setIsProcessing(false);
  //     setIsError(true);
  //     setTimeout(() => {
  //       setIsError(false);
  //     }, 3000);
  //   }
  // };

  const handleImage = (tokenAddress) => {
    const res = TokenList.filter(
      (list) =>
        list.address?.toLocaleLowerCase() === tokenAddress?.toLocaleLowerCase()
    );
    return res[0]?.logo;
  };

  const renderPrimaryDoge = (
    <div className="primary_doge">
      <img src={handleImage(payoutTokenAddress)} alt="dogecoin" width={24} />
      <span className="text_accent_primary_14" style={{ fontSize: 9 }}>
        {payoutToken}
      </span>
    </div>
  );

  const renderDogeX = (
    <div className="primary_doge">
      <img src={logo} alt="logo" width={24} />
    </div>
  );

  //RENDER SCREEN HEADER

  const renderHeader = (
    <div className="screen_header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" width={53} />
          <p className="title">LemonSwap</p>
        </Link>
      </div>
      <div>
        <div className="connect" onClick={() => setUserProfile(true)}>
          <p className="text_greendark_14">{`${account?.slice(
            0,
            4
          )}...${account?.slice(account?.length - 4)}`}</p>
          <span className="text_accent_primary_14">
            <CountUp start={0} end={dogexBalance} duration={2} />{" "}
          </span>
        </div>
        <img src={user} alt="user" width={24} />
      </div>
      
    </div>
  );

  //RENDER EARNNGS SECTION

  const renderEarning = (
    <div className="earnings">
      <div className="block_left">
        <p className="text_regular_14_w600">Autodividend Earnings</p>
        <div>
          <span className="text_orange_22">
            <CountUp
              start={0}
              end={autoDividendEarnings}
              decimals={autoDividendEarnings > 0 ? 4 : 0}
              duration={2}
            />{" "}
            BNB
          </span>
          <div style={{ display: "flex", flexDirection: "column", gridGap: 5 }}>
            <p className="text_primary_14">Paid in</p>
            {renderPrimaryDoge}
          </div>
        </div>
        <span></span>
        {/* <p className="text_regular_14_w600">Referral Earnings</p> */}
        {/* <div className="flex">
          <span className="text_orange_22">
            {numFormatter(referalEarnings)}
          </span>
          {renderDogeX}
        </div> */}
      </div>
      {/* <div className="block_right">
        <p className="text_accent_primary_14">Total earnings</p>
        <div>
          <p className="text_accent_primary_14">
            <CountUp
              start={0}
              end={withdrawable}
              decimals={withdrawable > 0 ? 4 : 0}
              duration={2}
            />
          </p>
          {renderSecondaryDoge}
        </div>
      </div> */}
    </div>
  );

  //RENDER INVITELINK PROMPT

  // const renderInviteLink = (
  //   <div className="invitelink_block">
  //     <p className="text_regular_14">
  //       Refer and earn commission in TERRA | any coin of choice
  //     </p>
  //     <div>
  //       <button className="inviteLink_btn" onClick={() => setInviteLink(true)}>
  //         Get invite link
  //       </button>
  //     </div>
  //   </div>
  // );

  //RENDER USER STATUS

  const renderUserStatus = (
    <div className="user_status">
      <div>
        {/* <p>
          <img src={creditcard} alt="credit card" />
          <span className="text_regular_14_w600">Total paid</span>
        </p> */}
        <p>
          <img src={hash} alt="hash" />
          <span className="text_regular_14_w600">Position</span>
        </p>
        {/* <p>
          <img src={refresh} alt="refresh" />
          <span className="text_regular_14_w600">Reinvesting</span>
        </p> */}
      </div>
      <div>
        {/* <div>
          <p className="text_orange_22">
            <CountUp
              start={0}
              end={paid}
              decimals={paid > 0 ? 4 : 0}
              duration={2.75}
            />
          </p>
          {renderPrimaryDoge}
        </div> */}
        <p className="text_orange_22">{position === -1 ? "NA" : position}</p>
        {/* <p
          className="primary_doge"
          style={{ cursor: "pointer" }}
          onClick={() => handleReinvesting(!reinvestingInfo)}
        >
          {!reinvestingInfo && <img src={circle} alt="circle" width={19} />}
          <span className="text_accent_primary_14" style={{ fontSize: 9 }}>
            Turn {reinvestingInfo ? "off" : "on"}
          </span>
          {reinvestingInfo && <img src={circle} alt="circle" width={19} />}
        </p> */}
      </div>
    </div>
  );

  const handleReward = async (tokenName, tokenAddress) => {
    setRewardTokenName(tokenName);
    setRewardCoinModal(false);
    setIsProcessing(true);
    try {
      await contract.methods
        .updatePayoutToken(tokenAddress)
        .send({ from: account });
      setRewardTokenName();
      setIsProcessing(false);
      setIsSuccess(true);
      handleGetInitialStatus();
      setTimeout(() => {
        setIsSuccess(false);
        setPayoutTokenAddress(tokenAddress);
        setPayoutToken(tokenName);
      }, 3000);
    } catch (error) {
      console.log(error);
      setRewardTokenName();
      setIsProcessing(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  //RENDER USER SELECT REWARD TOKEN

  const renderRewardToken = (
    <AnimatePresence>
      {rewardCoinModal && (
        <motion.div
          className="select_token"
          variants={selectRewardTokenDropdown}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {TokenList.map((list, index) => {
            return (
              <div
                style={{ pointerEvents: rewardTokenName && "none" }}
                onClick={() => handleReward(list.name, list.address)}
                key={index}
              >
                <p>
                  <img src={list.logo} alt="binance" width={24} />
                  <span className="text_accent_primary_14">{list.name}</span>
                </p>
                <img
                  src={rewardTokenName === list.name ? radioFilled : radio}
                  alt="radio"
                  width={20}
                />
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  //RENDER USER REWARDS

  const renderRewards = (
    <div className="rewards">
      <div className="select_rewards">
        <p className="text_regular_14_w600">Select reward coin</p>
        <div
          className="select_reward_coin"
          onClick={() => setRewardCoinModal(!rewardCoinModal)}
        >
          {renderPrimaryDoge}
          <img src={chevrondown} alt="down" width={24} />
        </div>
        {renderRewardToken}
      </div>
      {/* <div>
        <p className="text_regular_14_w600">Total payout</p>
        <p className="text_orange_22">
          <CountUp
            start={0}
            end={totalDividend}
            decimals={totalDividend > 0 ? 4 : 0}
            duration={3}
          />
        </p>
        <div style={{ display: "flex", alignItems: "center", gridGap: 8 }}>
          <span className="text_regular_14">paid in</span>
          {renderSecondaryDoge}
        </div>
      </div> */}
    </div>
  );

  //RENDER REFERRAL LINK PROMPT

  const renderRefferalUrl = (
    <></>
  );

  //RENDER USER PROFILE

  const renderUserProfile = (
    <>
      <div className="user_profile">
        <p className="text_greendark_14_normal">Current balance</p>
        <p
          className="text_accent_primary_14"
          style={{ fontSize: 22, marginBottom: 10 }}
        >
          <CountUp end={dogexBalance} /> Coins
        </p>
        <p className="text_greendark_14_normal">Metamask ID</p>
        <div>
          <span
            className="text_accent_primary_14"
            style={{ fontSize: 22 }}
          >{`${account?.slice(0, 4)}...${account?.slice(
            account?.length - 15
          )}`}</span>
          <CopyToClipboard text={account}>
            <img
              src={copy}
              alt="copy"
              width={22}
              onClick={() => {
                setIsAddressCopied(true);
                setTimeout(() => {
                  setIsAddressCopied(false);
                }, 3000);
              }}
            />
          </CopyToClipboard>
          <span className={isAddressCopied ? "copy_text active" : "copy_text"}>
            copied
          </span>
        </div>
      </div>
    </>
  );

  // const renderReferAndEarn = (
  //   <>
  //     <div className="refer_and_earn">
  //       <p className="text_accent_primary_12" style={{ fontWeight: 500 }}>
  //         Your referal url
  //       </p>
  //       <p className="text_accent_primary_22 referral_link">
  //         {`${process.env.React_App_base_url}?referrer=${account}`}
  //       </p>
  //     </div>
  //     <CopyToClipboard
  //       text={`${process.env.React_App_base_url}?referrer=${account}`}
  //     >
  //       <button
  //         className="btn_primary"
  //         onClick={() => {
  //           setIsCopied(true);
  //           setTimeout(() => {
  //             setIsCopied(false);
  //             setInviteLink(false);
  //           }, 2000);
  //         }}
  //       >
  //         {isCopied ? "COPIED TO CLIPBOARD" : "COPY REFERAL URL"}
  //       </button>
  //     </CopyToClipboard>
  //   </>
  // );

  //RENDER FORM

  const renderForm = (
    <div className="form">
      <iframe
        src={"https://pancakeswap.finance/swap?outputCurrency=" + address}
        frameBorder="0"
        width="inherit"
        height="450"
      ></iframe>
    </div>
  );

  //RENDER FOOTER TABS

  const renderTabs = (
    <div className="tabs">
      <div
        onClick={() => {
          // setIsLeaderBoard(false);
          // setIsReferrals(false);
        }}
      >
        <img src={home} alt="icon" />
        <p>Home</p>
      </div>      
    </div>
  );

  //RENDER SCREEN

  const renderScreen = (
    <div className="dashboard">
      {renderHeader}
      {
      // isLeaderBoard ? (
      //   <div>
      //     <Leaderboard
      //       allTimeLeaderboard={allTimeLeaderboard}
      //       dailyLeaderboard={dailyLeaderboard}
      //       weeklyLeaderboard={weeklyLeaderboard}
      //       monthlyLeaderboard={monthlyLeaderboard}
      //       isLoading={isLoading}
      //     />
      //   </div>
      // ) : 
      (
        <>
          {renderEarning}
          <div className="dashboard_block">
            <div className="block_one">
              {renderUserStatus}
              {renderRewards}
            </div>
            <div className="block_two">{renderForm}</div>

            {/* <div className="block_three">
              {renderUserStatus}
              
            </div> */}
      <UserModal
        title="Your account"
        description="your account details at a glance"
        content={renderUserProfile}
        isModal={userProfile}
        setIsModal={setUserProfile}
      />


            {/* <div className="block_three">
              <Leaderboard
                allTimeLeaderboard={allTimeLeaderboard}
                dailyLeaderboard={dailyLeaderboard}
                weeklyLeaderboard={weeklyLeaderboard}
                monthlyLeaderboard={monthlyLeaderboard}
                isLoading={isLoading}
              />
            </div> */}
            
          </div>
        </>
      )}
    </div>
  );

  //INITIAL PAGE LOAD

  if (initialLoad) {
    return <Modal />;
  }

  //RENDER IF USER IS INACTIVE

  if (!active) {
    return (
      <Modal
        variant="connectwallet"
        title="Select your wallet"
        description="connect your crypto wallet to continue"
        buttonText="CONNECT WALLET"
      />
    );
  }

  //RENDER IF USER HAS REFERRER

  // if (referrerAddress) {
  //   return (
  //     <Modal
  //       variant="acceptReferrer"
  //       title="Accept the referral"
  //       description="Accepting this referral and pay 5% LESS tax on your $DogeDealer purchase!"
  //       buttonText="ACCEPT NOW"
  //       referrerAddress={referrerAddress}
  //       setReferrerAddress={setReferrerAddress}
  //       setIsProcessing={setIsProcessing}
  //       setIsSuccess={setIsSuccess}
  //     />
  //   );
  // }

  return (
    <>
      {renderScreen}
      {renderTabs}
      <div className="referral_block_web">
        {renderUserStatus}
        
      </div>
      <UserModal
        title="Your account"
        description="your account details at a glance"
        content={renderUserProfile}
        isModal={userProfile}
        setIsModal={setUserProfile}
      />
      {/* <UserModal
        title="Refer & Earn"
        description="refer and earn commision on DOGE or any coin of choice"
        content={renderReferAndEarn}
        isModal={inviteLink}
        setIsModal={setInviteLink}
      /> */}

      <PaymentModal
        variant="payment"
        type="process"
        title="Payment processing"
        description="Hold tight! Your payment is processing. It usaually takes few seconds to complete the payment. Please be patient if its taking longer than it is usually expected"
        footerText="Authenticating payment by Metamask Wallet"
        isModal={isProcessing}
        setIsModal={setIsProcessing}
      />
      <PaymentModal
        variant="payment"
        type="success"
        title="Payment complete"
        description="Congratulations! Your transaction is complete. You can find the ammount added to your wallet in a while. It  usually takes few minutes to reflect your balance."
        footerText="Secure payment by Metamask Wallet"
        isModal={isSuccess}
        setIsModal={setIsSuccess}
      />
      <PaymentModal
        variant="payment"
        type="error"
        title="Payment incomplete"
        description="We’re sorry! Your transaction couldnot take place. This might be due to some technical error at our end. Please retry after sometime to complete your transaction."
        footerText="Error code #1121"
        isModal={isError}
        setIsModal={setIsError}
      />
    </>
  );
};

export default Dashboard;
