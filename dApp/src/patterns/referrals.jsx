import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import HashLinks from "../components/hashLinks";
import "../styles/patterns/referrals.scss";

import down from "../assets/icons/down.svg";
import UserModal from "./userModal";
import { useWeb3React } from "@web3-react/core";

const Referrals = ({ referralData, TotalReferrals }) => {
  console.log(TotalReferrals);
  const [inviteLink, setInviteLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [dataLength, setDataLength] = useState(10);

  const { account } = useWeb3React();

  const renderTotalLinks = (
    <div className="total_links">
      <div className="total">
        <p className="text_accent_primary_14">Total referred</p>
        <p className="text_accent_primary_22">{TotalReferrals}</p>
      </div>
      <button
        className="inviteLink_btn"
        onClick={() =>
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSdS2NYtyd7FL-Qf7Ap1MGpONwLoPRSB-A1tvbT5NpLe-ZTDiw/viewform"
          )
        }
      >
        Apply for custom link
      </button>
    </div>
  );

  const renderReferAndEarn = (
    <>
      <div className="refer_and_earn">
        <p className="text_accent_primary_12" style={{ fontWeight: 500 }}>
          Your referal url
        </p>
        <p className="text_accent_primary_22 referral_link">
          {`${process.env.React_App_base_url}?referrer=${account}`}
        </p>
      </div>
      <CopyToClipboard
        text={`${process.env.React_App_base_url}?referrer=${account}`}
      >
        <button
          className="btn_primary"
          onClick={() => {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          }}
        >
          {isCopied ? "COPIED TO CLIPBOARD" : "COPY REFERAL URL"}
        </button>
      </CopyToClipboard>
    </>
  );

  return (
    <>
      <div className="referral">
        <p className="heading text_primary_14">My referrals</p>
        {renderTotalLinks}

        {referralData?.length > 0 ? (
          <div className="renderLinks">
            {referralData?.slice(0, dataLength)?.map((value, index) => (
              <HashLinks
                variant="primary"
                data={value}
                key={index.toString()}
              />
            ))}
          </div>
        ) : (
          <div>
            <center>No referrals yet</center>
          </div>
        )}

        {referralData?.length > 10 && (
          <div
            className="referralFoot"
            onClick={() => setDataLength(dataLength + 10)}
          >
            <span className="text_accent_primary_12">view more</span>
            <img src={down} alt="down" />
          </div>
        )}
      </div>
      {inviteLink && (
        <UserModal
          title="Refer & Earn"
          description="refer and earn commision on DOGE or any coin of choice"
          content={renderReferAndEarn}
          setIsModal={setInviteLink}
        />
      )}
    </>
  );
};

export default Referrals;
