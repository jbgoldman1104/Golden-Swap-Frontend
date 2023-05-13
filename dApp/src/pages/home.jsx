import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';

import { Button, Icon, IconButton, Input, Stack } from '@mui/material';

import logo from '../assets/logos/logo.png';

import HomeBody from '../components/homeBody';

// Code Interaction
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

//IMPORTING UTILITY PACKAGES

import { injected, walletconnect } from "../utils/connector";


// Code Interaction
import { abi, address } from "../utils/constants";
import { unatomic } from "../utils/util";

import Modal from "../patterns/modal";

import { TokenList } from '../utils/constants';

// Transaction Processing
import PaymentModal from "../patterns/paymentModal";


function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function BackToTop(props) {
  const [isMetamask, setIsMetamask] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);

  const { active, library, account, activate, deactivate } = useWeb3React();

  const [initialLoad, setInitialLoad] = useState(true);

  const [walletInfo, setWalletInfo] = useState([0, 0, 0, 0, 0]);

    const [paid, setPaid] = useState(0); //Total Earned
    const [autoDividendEarnings, setAutoDividendEarnings] = useState(0);
    const [withdrawable, setWithdrawable] = useState(0);
    
    const [totalDividend, setTotalDividend] = useState(0);
    const [selectedToken, setSelectedToken] = useState(
        "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    );
    const [payoutToken, setPayoutToken] = useState("BNB");
    const [decimals, setDecimals] = useState();
    const [nativeDecimals, setNativeDecimals] = useState();
    const [payoutTokenAddress, setPayoutTokenAddress] = useState(
        "0x0000000000000000000000000000000000000000"
    );

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const web3 = new Web3(library);
    const contract = new web3.eth.Contract(abi, address);
    const bnb = {
        address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        decimal: 18,
    };

    // get Wallet Info 
    // get balances for each token for account
    const getWalletInfo = async () => {
      let Token;
      let decimal;
      let item;
      let result = [];

      for (let i = 0; i < TokenList.length; i++) {
        item = TokenList[i];

        if (item.address !== "0x0000000000000000000000000000000000000000") {
          Token = new web3.eth.Contract(abi, item.address);
          decimal = await Token.methods.decimals().call();
          result[i] = unatomic(
            await Token.methods.balanceOf(account).call(),
            decimal
          );
          
        } else {
          // Token = new web3.eth.Contract(abi, "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"); //WBNB
          result[i] = unatomic(
            await web3.eth.getBalance(account),
            18
          );
        }
      }

      setWalletInfo(result);
      
      // let result = TokenList.map(async (item, index) => {
      //   if (item.address !== "0x0000000000000000000000000000000000000000") {
      //     Token = new web3.eth.Contract(abi, item.address);
      //   } else {
      //     Token = new web3.eth.Contract(abi, "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c");
      //   }
        
      //   decimal = await Token.methods.decimals().call();
      //   return await Token.methods.balanceOf(account).call();
      // })
    }

    // Working
    const getUserToken = async () => {
        const nativeDecimal = await contract.methods.decimals().call();
        const userTokenAddress = await contract.methods
        .getPayoutToken(account)
        .call();

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

    const getTotalDividendDistributed = async () => {
      return unatomic(
        await contract.methods.getTotalDividendsDistributed().call(),
        18
      );
    };
    
    const getWithdrawable = async () => {
      return unatomic(
        await contract.methods.withdrawableDividendOf(account).call(),
        18
      );
    };


    const updatePayoutToken = async (tokenAddress) => {
      setIsProcessing(true);
      try {
        await contract.methods
          .updatePayoutToken(tokenAddress)
          .send({ from: account });

        setIsProcessing(false);
        setIsSuccess(true);
        handleGetInitialStatus();
        setTimeout(() => {
          setIsSuccess(false);
          setPayoutTokenAddress(tokenAddress);
          // setPayoutToken(tokenName);
        }, 3000);
      } catch (error) {
        // setRewardTokenName();
        setIsProcessing(false);
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);        
      }
    }

    const claimHandler = async (tokenAddress) => {
      setIsProcessing(true);
      try {
        await contract.methods
          .claimFor(tokenAddress)
          .send({ from: account });

        setIsProcessing(false);
        setIsSuccess(true);
        handleGetInitialStatus();
        setTimeout(() => {
          setIsSuccess(false);
          // setPayoutTokenAddress(tokenAddress);
          // setPayoutToken(tokenName);
        }, 3000);
      } catch (error) {
        console.log(error);
        // setRewardTokenName();
        setIsProcessing(false);
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);        
      }
    }

    // const getTotalEarned = async () => {
    //   consol.log("[AL] - getTotalEarned()")
    //   return unatomic(
    //     await contract.methods.withdrawnDividendOf(account).call(),
    //     18
    //   )
    // }
    
      // Working: Get balance of LemonSwap
    //   const getDogexBalance = async () => {
    //     return unatomic(await contract.methods.balanceOf(account).call(), 9);
    //   };
    
      // Working : 
      const accountInfo = async () => {
        const dividendEarned = await contract.methods
          .getAccountDividendsInfo(account)
          .call();
        // setPosition(Number(dividendEarned[2]));

        setPaid(unatomic(dividendEarned[4], bnb.decimal));

        return unatomic(
          (dividendEarned[4] - dividendEarned[3]).toString(),
          bnb.decimal
        );
      };
    
      const handleGetInitialStatus = async () => {
        // setDogexBalance(await getDogexBalance());
        getWalletInfo();
        setAutoDividendEarnings(await accountInfo());

        const user = await getUserToken();
    
        if (user !== undefined) {
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
    //   setAutoDividendEarnings(await accountInfo(userTokenAddress));
    }
  }, [active, account, library, selectedToken]);


  //INITIAL PAGE LOAD
  if (initialLoad) {
      return <Modal />;
  }

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


                // isMetamask
                //   ? () => activate(injected)
                //   : isTrustWallet
                //   ? () => activate(walletconnect)
                //   : null


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar style={{
        //   backgroundColor: 'black'
        //   backgroundColor: "#7cd6e6"
        background: "linear-gradient(90deg, #456c13 3.48%, #6eb018 50.65%, #5c9716 100% )"
          }}>
        <Toolbar>
          <IconButton color="inherit">
              <img src={logo} alt="Logo" width='60px'/>
          </IconButton>
          <Typography variant="h6" component="div"
            style={{color:'#FFFFFF', fontSize:'32px'}}>
            LemonSwap
          </Typography>

          <Button variant="contained"
              style={{margin:"0 0 0 auto"}}
              onClick={
                active ? () => deactivate() : null
              }
          >
            <p className="text_greendark_14" style={{color:"white"}}>{`${account?.slice(
            0,
            4
          )}...${account?.slice(account?.length - 4)}`}</p>
          </Button>

        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
          <HomeBody 
            withdrawable={withdrawable} 
            totalDividend={totalDividend}
            totalEarned = {paid}
            walletInfo = {walletInfo}
            payoutTokenAddress = {payoutTokenAddress}

            updatePayoutToken = {updatePayoutToken}
            claimHandler = {claimHandler}
            />
      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>

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
    </React.Fragment>
  );
}
