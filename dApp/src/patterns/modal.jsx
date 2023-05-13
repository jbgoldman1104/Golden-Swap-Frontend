import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Web3 from "web3";
import { abi, address } from "../utils/constants";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
//STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING MEDIA ASSETSS

import metamask from "../assets/logos/metamaskwallet.svg";
import trustwallet from "../assets/logos/trustwallet.svg";
import logo from "../assets/logos/logo.png";
import initialload from "../assets/icons/initialload.svg";

//IMPORTING UTILITY PACKAGES

import { injected, walletconnect } from "../utils/connector";

const Modal = ({
  variant,
  onClick,
  title,
  description,
  buttonText,
  chainId,
  referrerAddress,
  setReferrerAddress,
  setIsSuccess,
}) => {
  const [isMetamask, setIsMetamask] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();
  const history = useHistory();

  const handleWallet = (wallet) => {
    if (wallet === "metamask") {
      setIsMetamask(true);
      setIsTrustWallet(false);
    }
    if (wallet === "trustwallet") {
      setIsMetamask(false);
      setIsTrustWallet(true);
    }
  };

  const { library, account, activate } = useWeb3React();

  const renderModalHeader = (
    <div className="modal_header">
      <div>
        <p className="text_accent_primary_14">{title}</p>
        <p className="text_accent_primary_10">{description}</p>
      </div>
    </div>
  );

  const renderButton = (
    <>
      <button
        className="btn_primary"
        onClick={
          isMetamask
            ? () => activate(injected)
            : isTrustWallet
            ? () => activate(walletconnect)
            : null
        }
      >
        {buttonText}
      </button>
    </>
  );
  const renderConnectWallet = (
    <div className="backdrop">
      <div className="modal">
        {renderModalHeader}
        <div className="modal_connectwallets">
          <div
            onClick={() => handleWallet("metamask")}
            style={{ border: isMetamask && "2px solid #FFA725" }}
          >
            <p className="text_accent_primary_14">Metamask</p>
            <img src={metamask} alt="metamask logo" width={36} />
          </div>
          <div
            onClick={() => handleWallet("trustwallet")}
            style={{ border: isTrustWallet && "2px solid #FFA725" }}
          >
            <p className="text_accent_primary_14">Trust Wallet</p>
            <img src={trustwallet} alt="trustwallet logo" width={36} />
          </div>
        </div>
        {renderButton}
      </div>
    </div>
  );

  const renderWrongNetwork = (
    <div className="backdrop">
      <div className="modal">
        {renderModalHeader}
        {/* <div className="wrong_network_block">
          <p>
            <img src={radio} alt="radio" />
            <span>Ropsten Test Network</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Kovan Test Network</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Binance Smart Mainnet</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Gorelli test network</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Etherium Mainnet</span>
          </p>
        </div> */}
      </div>
    </div>
  );

  const renderInitailLoad = (
    <div className="backdrop">
      <div className="initial_load_modal">
        <img src={logo} alt="logo" width={200} />
        <p>L E M O N S W A P</p>
        <img
          src={initialload}
          alt="loader"
          width={45}
          style={{ marginTop: 40 }}
        />
      </div>
    </div>
  );

  switch (variant) {
    case "connectwallet":
      return renderConnectWallet;
    case "wrongNetwork":
      return renderWrongNetwork;
    default:
      return renderInitailLoad;
  }
};

export default Modal;
